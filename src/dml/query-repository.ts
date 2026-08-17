import { Repository, RepositoryOptions, RepositoryInit } from '../repository';
import { DatabaseRecord } from '../record';
import {
	DatabaseQueryBuilder,
	DeleteOptions,
	InsertOneOptions,
	InsertOptions,
	SelectQuery,
	UpdateOptions,
} from '../dml';
import { Schema } from '../schema';
import { DatabaseFunctions } from '../functions';
import { CountParams } from '../functions/signatures/count';
import { SetOptions } from './set-options';
import { ColumnOptions, ColumnType } from '../column';

export interface QueryRepositoryOptions extends RepositoryOptions {
	schemacb?: () => Promise<Schema>;
	table?: string;
	identifiedBy?: string;
	queryBuilderType: typeof DatabaseQueryBuilder;
}

export interface QueryRepositoryInit extends RepositoryInit {
	schema?: Schema;
}

/**
 * Use the Query Repository to query a database
 */
export class QueryRepository<
	T extends DatabaseRecord = DatabaseRecord,
> extends Repository {
	protected schema?: Schema;
	protected schemacb?: () => Promise<undefined | Schema>;
	protected table?: string;
	protected identifiedBy?: string;
	protected queryBuilderType: typeof DatabaseQueryBuilder;

	public constructor(options: QueryRepositoryOptions) {
		super(options);

		this.table = options.table ?? this.table;
		this.identifiedBy = options.identifiedBy ?? this.identifiedBy;
		this.queryBuilderType =
			options.queryBuilderType ?? this.queryBuilderType;

		this.schemacb =
			options.schemacb ?? (async () => Promise.resolve(undefined));
	}

	public override init(options: QueryRepositoryInit) {
		super.init(options);

		this.schema = options.schema;
		this.getIdentifier();
		this.isReady = true;
	}

	public getTableName(): null | string {
		return this.table ?? null;
	}

	public getIdentifier(): null | string {
		if (
			!this.identifiedBy &&
			this.table &&
			this.schema &&
			this.table in this.schema.tables
		) {
			this.identifiedBy = this.schema.tables[this.table].primaryKey;
		}

		return this.identifiedBy ?? null;
	}

	public getQueryBuilder(): DatabaseQueryBuilder {
		return new this.queryBuilderType();
	}

	public async queryResponseParser(
		query: SelectQuery,
		results: DatabaseRecord[]
	): Promise<T[]> {
		if (!this.schemacb) {
			return results as T[];
		}

		for (const row of results) {
			for (const key in row) {
				const value: any = row[key];
				const keyParts = key.split('.');
				let table = undefined;
				let column = undefined;

				if (keyParts.length === 3) {
					// riao_db.my_table.cool_column
					table = keyParts[1];
					column = keyParts[2];
				}
				else if (keyParts.length === 2) {
					// my_table.cool_column
					table = keyParts[0];
					column = keyParts[1];
				}
				else if (keyParts.length === 1) {
					// cool_column
					table = query.table;
					column = keyParts[0];
				}

				const columnOptions: ColumnOptions = (await this.schemacb())
					?.tables[table].columns[column];

				if (!columnOptions) {
					continue;
				}

				if (columnOptions.type === ColumnType.BOOL) {
					row[key] = <any>!!value;
				}
				else if (
					columnOptions.type === ColumnType.TINYINT ||
					columnOptions.type === ColumnType.SMALLINT ||
					columnOptions.type === ColumnType.INT
				) {
					row[key] = <any>parseInt(value, 10);
				}
				else if (columnOptions.type === ColumnType.BIGINT) {
					row[key] = <any>BigInt(value);
				}
				else if (
					columnOptions.type === ColumnType.DECIMAL ||
					columnOptions.type === ColumnType.FLOAT ||
					columnOptions.type === ColumnType.DOUBLE
				) {
					row[key] = <any>parseFloat(value);
				}
				else if (columnOptions.type === ColumnType.TIMESTAMP) {
					row[key] = <any>(
						(value instanceof Date ? value : new Date(value))
					);
				}
				else if (columnOptions.type === ColumnType.BLOB) {
					row[key] = <any>(
						(value instanceof Buffer ? value : Buffer.from(value))
					);
				}
			}
		}

		return results as T[];
	}

	/**
	 * Finds entities matching given criteria
	 *
	 * @param selectQuery Select query
	 * @returns Found entities
	 */
	public async find(selectQuery: SelectQuery<T>): Promise<T[]> {
		selectQuery.table = selectQuery.table || this.table;

		const query = this.getQueryBuilder()
			.select(selectQuery)
			.toDatabaseQuery();

		const { results } = await this.query(query);

		return await this.queryResponseParser(
			selectQuery,
			results as DatabaseRecord[]
		) as T[];
	}

	/**
	 * Finds one entity matching given criteria
	 *
	 * @param selectQuery Select query
	 * @returns Found entity or `null`
	 */
	public async findOne(selectQuery: SelectQuery<T>): Promise<null | T> {
		selectQuery.table = selectQuery.table || this.table;

		const query = this.getQueryBuilder()
			.select({
				...selectQuery,
				limit: 1,
			})
			.toDatabaseQuery();

		const { results } = await this.query(query);

		if (!results?.length) {
			return null;
		}

		return (await this.queryResponseParser(
			selectQuery,
			results as DatabaseRecord[])
		)[0];
	}

	public async findById(id: number | string): Promise<null | T> {
		// Ready-check before throwing a PK error
		this.readyCheck();

		if (!this.getIdentifier()) {
			throw new Error(
				'findById() Could not determine PK for table "' +
					this.table +
					'"'
			);
		}

		return await this.findOne({
			where: <any>{ [this.identifiedBy as string]: id },
		});
	}

	/**
	 * Finds one entity matching given criteria, or throws error
	 *
	 * @param selectQuery Select query
	 * @param error Error to throw
	 * @returns Found entity
	 */
	public async findOneOrFail(
		selectQuery: SelectQuery<T>,
		error?: Error
	): Promise<T> {
		selectQuery.table = selectQuery.table || this.table;

		const result = await this.findOne(selectQuery);

		if (result === null) {
			throw error ?? new Error('Result not found!');
		}

		return result;
	}

	public async count(
		selectQuery: SelectQuery<T> = {},
		params?: CountParams
	): Promise<number> {
		const { count } = await this.findOneOrFail({
			...selectQuery,
			columns: [
				{
					query: DatabaseFunctions.count(params),
					as: 'count',
				},
			],
		});

		return +count;
	}

	/**
	 * Insert one or multiple items into the database
	 *
	 * @param insertOptions Insert options
	 * @returns Inserted item(s)
	 */
	public async insert(insertOptions: InsertOptions<T>): Promise<void> {
		const table = insertOptions.table || this.table;

		if (!table) {
			throw new Error(
				'Cannot insert on query repository without a table.'
			);
		}

		const query = this.getQueryBuilder()
			.insert({
				table,
				primaryKey: undefined,
				...insertOptions,
			})
			.toDatabaseQuery();

		await this.query(query);
	}

	/**
	 * Insert one item into the database
	 *
	 * @param insertOptions Insert options
	 * @returns Inserted item
	 */
	public async insertOne(
		insertOptions: InsertOneOptions<T>
	): Promise<Partial<T>> {
		// Ready-check before throwing a PK error
		this.readyCheck();

		const table = insertOptions.table || this.table;

		if (!table) {
			throw new Error(
				'Query repository cannot insertOne without a table.'
			);
		}

		insertOptions.primaryKey =
			insertOptions.primaryKey ||
			this.schema?.tables[table]?.primaryKey ||
			this.identifiedBy;

		if (!insertOptions.primaryKey && !insertOptions.ignoreReturnId) {
			throw new Error(
				'insertOne() cannot determine PK to return. Pass a primaryKey argument or ignoreReturnId: true to suppress this safety. https://github.com/riao-project/riao-dbal/issues/4'
			);
		}

		const query = this.getQueryBuilder()
			.insert({
				table,
				...insertOptions,
				records: insertOptions.record,
			})
			.toDatabaseQuery();

		const { results } = await this.query(query);

		if (insertOptions.primaryKey && Array.isArray(results)) {
			return <any>results[0];
		}
		else {
			return {};
		}
	}

	/**
	 * Update items in the database
	 *
	 * @param updateOptions Update options
	 */
	public async update(updateOptions: UpdateOptions<T>): Promise<void> {
		const table = updateOptions.table || this.table;

		if (!table) {
			throw new Error(
				'Query repository cannot update() without a table.'
			);
		}

		const query = this.getQueryBuilder()
			.update({ table, ...updateOptions })
			.toDatabaseQuery();

		await this.query(query);
	}

	/**
	 * Set a variable
	 *
	 * @param setOptions
	 */
	public async set(setOptions: SetOptions): Promise<void> {
		const query = this.getQueryBuilder().set(setOptions).toDatabaseQuery();

		await this.query(query);
	}

	/**
	 * Delete items from the database
	 *
	 * @param deleteOptions Delete options
	 */
	public async delete(deleteOptions: DeleteOptions<T>): Promise<void> {
		const table = deleteOptions.table || this.table;

		if (!table) {
			throw new Error(
				'Query repository cannot update() without a table.'
			);
		}

		const query = this.getQueryBuilder()
			.delete({ table, ...deleteOptions })
			.toDatabaseQuery();

		await this.query(query);
	}
}
