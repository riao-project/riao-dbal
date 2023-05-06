import { Repository } from '../repository';
import { DatabaseRecord } from '../record';
import {
	DeleteOptions,
	InsertOptions,
	SelectQuery,
	UpdateOptions,
} from '../dml';

/**
 * Use the Query Repository to query a database
 */
export class QueryRepository<
	T extends DatabaseRecord = DatabaseRecord
> extends Repository {
	/**
	 * Finds entities matching given criteria
	 *
	 * @param selectQuery Select query
	 * @returns Found entities
	 */
	public async find(selectQuery: SelectQuery<T>): Promise<T[]> {
		const query = this.driver
			.getQueryBuilder()
			.select(selectQuery)
			.toDatabaseQuery();

		const { results } = await this.driver.query(query);

		return results as T[];
	}

	/**
	 * Finds one entity matching given criteria
	 *
	 * @param selectQuery Select query
	 * @returns Found entity or `null`
	 */
	public async findOne(selectQuery: SelectQuery<T>): Promise<null | T> {
		const query = this.driver
			.getQueryBuilder()
			.select({
				...selectQuery,
				limit: 1,
			})
			.toDatabaseQuery();

		const { results } = await this.driver.query(query);

		if (!results.length) {
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
		const result = await this.findOne(selectQuery);

		if (result === null) {
			throw error ?? new Error('Result not found!');
		}

		return result;
	}

	/**
	 * Insert one or multiple items into the database
	 *
	 * @param insertOptions Insert options
	 * @returns Inserted item(s)
	 */
	public async insert(insertOptions: InsertOptions<T>): Promise<T | T[]> {
		const query = this.driver
			.getQueryBuilder()
			.insert(insertOptions)
			.toDatabaseQuery();

		const { results } = await this.driver.query(query);

		if (Array.isArray(insertOptions.records)) {
			return results as T[];
		}
		else {
			return results[0] as T;
		}
	}

	/**
	 * Update items in the database
	 *
	 * @param updateOptions Update options
	 */
	public async update(updateOptions: UpdateOptions<T>): Promise<void> {
		const query = this.driver
			.getQueryBuilder()
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
		const query = this.driver
			.getQueryBuilder()
			.delete(deleteOptions)
			.toDatabaseQuery();

		await this.driver.query(query);
	}
}
