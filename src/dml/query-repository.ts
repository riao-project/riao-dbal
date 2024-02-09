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
import { CountParams } from 'src/functions/signatures/count';

export interface QueryRepositoryOptions extends RepositoryOptions {
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
	T extends DatabaseRecord = DatabaseRecord
> extends Repository {
	protected schema?: Schema;
	protected table?: string;
	protected identifiedBy?: string;
	protected queryBuilderType: typeof DatabaseQueryBuilder;

	public constructor(options: QueryRepositoryOptions) {
		super(options);

		this.table = options.table;
		this.identifiedBy = options.identifiedBy;
		this.queryBuilderType = options.queryBuilderType;
	}

	public init(options: QueryRepositoryInit) {
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

		return (results ?? []) as T[];
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

		return results[0] as T;
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
			where: <any>{ [this.identifiedBy]: id },
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
		const { count } = await this.findOne({
			...selectQuery,
			columns: [
				{
					query: DatabaseFunctions.count(params),
					as: 'count',
				},
			],
		});

		return count;
	}

	/**
	 * Insert one or multiple items into the database
	 *
	 * @param insertOptions Insert options
	 * @returns Inserted item(s)
	 */
	public async insert(insertOptions: InsertOptions<T>): Promise<void> {
		insertOptions.table = insertOptions.table || this.table;
		insertOptions.primaryKey = null;

		const query = this.getQueryBuilder()
			.insert(insertOptions)
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

		insertOptions.table = insertOptions.table || this.table;
		insertOptions.primaryKey =
			insertOptions.primaryKey ||
			this.schema?.tables[insertOptions.table]?.primaryKey;

		if (!insertOptions.primaryKey && !insertOptions.ignoreReturnId) {
			throw new Error(
				'insertOne() cannot determine PK to return. Pass a primaryKey argument or ignoreReturnId: true to suppress this safety. https://github.com/riao-project/riao-dbal/issues/4'
			);
		}

		const query = this.getQueryBuilder()
			.insert({
				...insertOptions,
				records: insertOptions.record,
			})
			.toDatabaseQuery();

		const { results } = await this.query(query);

		if (insertOptions.primaryKey && Array.isArray(results)) {
			return <any>results[0];
		}
		else {
			return null;
		}
	}

	/**
	 * Update items in the database
	 *
	 * @param updateOptions Update options
	 */
	public async update(updateOptions: UpdateOptions<T>): Promise<void> {
		updateOptions.table = updateOptions.table || this.table;

		const query = this.getQueryBuilder()
			.update(updateOptions)
			.toDatabaseQuery();

		await this.query(query);
	}

	/**
	 * Delete items from the database
	 *
	 * @param deleteOptions Delete options
	 */
	public async delete(deleteOptions: DeleteOptions<T>): Promise<void> {
		deleteOptions.table = deleteOptions.table || this.table;

		const query = this.getQueryBuilder()
			.delete(deleteOptions)
			.toDatabaseQuery();

		await this.query(query);
	}
}
