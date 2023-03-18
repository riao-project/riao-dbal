import { CreateTableOptions, DropTableOptions, TruncateOptions } from '../ddl';
import { Repository } from './repository';

/**
 * Use the DDL Repository to create & modify your database schema
 */
export class DataDefinitionRepository extends Repository {
	/**
	 * Create a new table
	 *
	 * @param options Table options
	 */
	public async createTable(options: CreateTableOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().createTable(options)
		);
	}

	/**
	 * Drop an existing table
	 *
	 * @param options Options
	 */
	public async dropTable(options: DropTableOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().dropTable(options)
		);
	}

	/**
	 * Truncate an existing table
	 *
	 * @param options Options
	 */
	public async truncate(options: TruncateOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().truncate(options)
		);
	}
}
