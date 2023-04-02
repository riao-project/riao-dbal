import {
	AddColumnsOptions,
	AddForeignKeyOptions,
	ChangeColumnOptions,
	DropForeignKeyOptions,
	RenameColumnOptions,
	RenameTableOptions,
} from '../ddl/alter-table';
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
	 * Add columns to a table
	 *
	 * @param options Add column options
	 */
	public async addColumns(options: AddColumnsOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().addColumns(options)
		);
	}

	/**
	 * Add a foreign key to a table
	 *
	 * @param options Foreign key options
	 */
	public async addForeignKey(options: AddForeignKeyOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().addForeignKey(options)
		);
	}

	/**
	 * Change a column
	 *
	 * @param options Column options
	 */
	public async changeColumn(options: ChangeColumnOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().changeColumn(options)
		);
	}

	/**
	 * Drop a column
	 *
	 * @param options Drop options
	 */
	public async dropColumn(options: ChangeColumnOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().dropColumn(options)
		);
	}

	/**
	 * Drop a foreign key constraint
	 *
	 * @param options Drop options
	 */
	public async dropForeignKey(options: DropForeignKeyOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().dropForeignKey(options)
		);
	}

	/**
	 * Rename a column
	 *
	 * @param options Rename options
	 */
	public async renameColumn(options: RenameColumnOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().renameColumn(options)
		);
	}

	/**
	 * Rename a table
	 *
	 * @param options Rename options
	 */
	public async renameTable(options: RenameTableOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().renameTable(options)
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
