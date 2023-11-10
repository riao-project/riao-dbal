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

export interface QueryRepositoryOptions extends RepositoryOptions {
	table?: string;
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
	protected queryBuilderType: typeof DatabaseQueryBuilder;

	public constructor(options: QueryRepositoryOptions) {
		super(options);

		this.table = options.table;
		this.queryBuilderType = options.queryBuilderType;
	}

	public init(options: QueryRepositoryInit) {
		super.init(options);

		this.schema = options.schema;
	}

	public getTableName(): null | string {
		return this.table ?? null;
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

		const { results } = await this.driver.query(query);

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

		const { results } = await this.driver.query(query);

		if (!results?.length) {
			return null;
		}

		return results[0] as T;
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

	public async count(selectQuery: SelectQuery<T> = {}): Promise<number> {
		const { count } = await this.findOne({
			...selectQuery,
			columns: [{ query: DatabaseFunctions.count(), as: 'count' }],
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

		await this.driver.query(query);
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
			.insert(insertOptions)
			.toDatabaseQuery();

		const { results } = await this.driver.query(query);

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

		await this.driver.query(query);
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

		await this.driver.query(query);
	}
}
