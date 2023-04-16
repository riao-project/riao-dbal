import {
	AddColumnsOptions,
	AddForeignKeyOptions,
	ChangeColumnOptions,
	DropForeignKeyOptions,
	RenameColumnOptions,
	RenameTableOptions,
} from '../ddl/alter-table';

import {
	CreateDatabaseOptions,
	CreateTableOptions,
	CreateUserOptions,
	GrantOptions,
	DropDatabaseOptions,
	DropTableOptions,
	DropUserOptions,
	TruncateOptions,
} from '../ddl';

import { Repository } from './repository';

/**
 * Use the DDL Repository to create & modify your database schema
 */
export class DataDefinitionRepository extends Repository {
	/**
	 * Create a new database
	 *
	 * @param options Database options
	 */
	public async createDatabase(options: CreateDatabaseOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().createDatabase(options)
		);
	}

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
	 * Create a new user
	 *
	 * @param options Table options
	 */
	public async createUser(options: CreateUserOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().createUser(options)
		);
	}

	/**
	 * Grant privilige(s) to user(s)/role(s)
	 *
	 * @param options Grant options
	 */
	public async grant(options: GrantOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().grant(options)
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
	 * Drop a database
	 *
	 * @param options Options
	 */
	public async dropDatabase(options: DropDatabaseOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().dropDatabase(options)
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
	 * Drop user(s)
	 *
	 * @param options Options
	 */
	public async dropUser(options: DropUserOptions): Promise<void> {
		await this.driver.query(
			this.driver.getDataDefinitionBuilder().dropUser(options)
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
