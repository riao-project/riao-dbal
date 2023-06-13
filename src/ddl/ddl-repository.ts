import {
	AddColumnsOptions,
	AddForeignKeyOptions,
	ChangeColumnOptions,
	DropColumnOptions,
	DropForeignKeyOptions,
	RenameColumnOptions,
	RenameTableOptions,
	CreateDatabaseOptions,
	CreateTableOptions,
	CreateUserOptions,
	GrantOptions,
	DropDatabaseOptions,
	DropTableOptions,
	DropUserOptions,
	TruncateOptions,
	DataDefinitionBuilder,
} from '../ddl';

import { Repository, RepositoryOptions } from '../repository';

export interface DDLRepositoryOptions extends RepositoryOptions {
	ddlBuilderType: typeof DataDefinitionBuilder;
}

/**
 * Use the DDL Repository to create & modify your database schema
 */
export class DataDefinitionRepository extends Repository {
	protected ddlBuilderType: typeof DataDefinitionBuilder =
		DataDefinitionBuilder;

	public constructor(options: DDLRepositoryOptions) {
		super(options);

		this.ddlBuilderType = options.ddlBuilderType;
	}

	public getDDLBuilder(): DataDefinitionBuilder {
		return new this.ddlBuilderType();
	}

	/**
	 * Create a new database
	 *
	 * @param options Database options
	 */
	public async createDatabase(options: CreateDatabaseOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().createDatabase(options));
	}

	/**
	 * Create a new table
	 *
	 * @param options Table options
	 */
	public async createTable(options: CreateTableOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().createTable(options));
	}

	/**
	 * Create a new user
	 *
	 * @param options Table options
	 */
	public async createUser(options: CreateUserOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().createUser(options));
	}

	/**
	 * IMPORTANT: UNSTABLE. Grant is currently only compatible with
	 * 	mysql and mssql and may cause unintended side-effects and/or
	 * 	privilege escalation.
	 * This should not be used in most circumstances!
	 * Use a dedicated database connection for this method, as it may change
	 * 	the database connection's default database.
	 * This method and it's arguments are likely to change in future versions
	 *
	 * @param options Grant options
	 * @returns
	 */
	public async grant(options: GrantOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().grant(options));
	}

	/**
	 * Add columns to a table
	 *
	 * @param options Add column options
	 */
	public async addColumns(options: AddColumnsOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().addColumns(options));
	}

	/**
	 * Add a foreign key to a table
	 *
	 * @param options Foreign key options
	 */
	public async addForeignKey(options: AddForeignKeyOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().addForeignKey(options));
	}

	/**
	 * Change a column
	 *
	 * @param options Column options
	 */
	public async changeColumn(options: ChangeColumnOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().changeColumn(options));
	}

	/**
	 * Drop a column
	 *
	 * @param options Drop options
	 */
	public async dropColumn(options: DropColumnOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().dropColumn(options));
	}

	/**
	 * Drop a foreign key constraint
	 *
	 * @param options Drop options
	 */
	public async dropForeignKey(options: DropForeignKeyOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().dropForeignKey(options));
	}

	/**
	 * Rename a table
	 *
	 * @param options Rename options
	 */
	public async renameTable(options: RenameTableOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().renameTable(options));
	}

	/**
	 * Drop a database
	 *
	 * @param options Options
	 */
	public async dropDatabase(options: DropDatabaseOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().dropDatabase(options));
	}

	/**
	 * Drop an existing table
	 *
	 * @param options Options
	 */
	public async dropTable(options: DropTableOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().dropTable(options));
	}

	/**
	 * Drop user(s)
	 *
	 * @param options Options
	 */
	public async dropUser(options: DropUserOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().dropUser(options));
	}

	/**
	 * Truncate an existing table
	 *
	 * @param options Options
	 */
	public async truncate(options: TruncateOptions): Promise<void> {
		await this.driver.query(this.getDDLBuilder().truncate(options));
	}
}
