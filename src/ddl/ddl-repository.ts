import {
	AddColumnsOptions,
	AddForeignKeyOptions,
	ChangeColumnOptions,
	DropColumnOptions,
	DropForeignKeyOptions,
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
	CreateIndexOptions,
} from '../ddl';

import { Repository, RepositoryInit, RepositoryOptions } from '../repository';
import { DropTriggerOptions, TriggerOptions } from '../triggers';

export interface DDLRepositoryOptions extends RepositoryOptions {
	ddlBuilderType: typeof DataDefinitionBuilder;
}

export type DDLRepositoryInit = RepositoryInit;

/**
 * Use the DDL Repository to create & modify your database schema
 */
export class DataDefinitionRepository extends Repository {
	protected ddlBuilderType: typeof DataDefinitionBuilder =
		DataDefinitionBuilder;

	public constructor(options: DDLRepositoryOptions) {
		super(options);

		this.ddlBuilderType = options.ddlBuilderType ?? this.ddlBuilderType;
	}

	public override init(options: DDLRepositoryInit) {
		super.init(options);
		this.isReady = true;
	}

	public getDDLBuilder(): DataDefinitionBuilder {
		return new this.ddlBuilderType();
	}

	/**
	 * Temporarily disable foreign key checks on the session.
	 * 	Some databases may require escalated priveleges
	 */
	public async disableForeignKeyChecks(): Promise<void> {
		await this.query(this.getDDLBuilder().disableForeignKeyChecks());
	}

	/**
	 * Re-enable foreign key checks on the session.
	 * 	Some databases may require escalated priveleges
	 */
	public async enableForeignKeyChecks(): Promise<void> {
		await this.query(this.getDDLBuilder().enableForeignKeyChecks());
	}

	/**
	 * Create a new database
	 *
	 * @param options Database options
	 */
	public async createDatabase(options: CreateDatabaseOptions): Promise<void> {
		await this.query(this.getDDLBuilder().createDatabase(options));
	}

	/**
	 * Create a new table
	 *
	 * @param options Table options
	 */
	public async createTable(options: CreateTableOptions): Promise<void> {
		await this.query(this.getDDLBuilder().createTable(options));
	}

	/**
	 * Create an index on a table
	 *
	 * @param options Index options
	 */
	public async createIndex(options: CreateIndexOptions): Promise<void> {
		await this.query(this.getDDLBuilder().createIndex(options));
	}

	/**
	 * Create a new user
	 *
	 * @param options Table options
	 */
	public async createUser(options: CreateUserOptions): Promise<void> {
		await this.query(this.getDDLBuilder().createUser(options));
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
		await this.query(this.getDDLBuilder().grant(options));
	}

	/**
	 * Add columns to a table
	 *
	 * @param options Add column options
	 */
	public async addColumns(options: AddColumnsOptions): Promise<void> {
		await this.query(this.getDDLBuilder().addColumns(options));
	}

	/**
	 * Add a foreign key to a table
	 *
	 * @param options Foreign key options
	 */
	public async addForeignKey(options: AddForeignKeyOptions): Promise<void> {
		await this.query(this.getDDLBuilder().addForeignKey(options));
	}

	/**
	 * Change a column
	 *
	 * @param options Column options
	 */
	public async changeColumn(options: ChangeColumnOptions): Promise<void> {
		await this.query(this.getDDLBuilder().changeColumn(options));
	}

	/**
	 * Drop a column
	 *
	 * @param options Drop options
	 */
	public async dropColumn(options: DropColumnOptions): Promise<void> {
		await this.query(this.getDDLBuilder().dropColumn(options));
	}

	/**
	 * Drop a foreign key constraint
	 *
	 * @param options Drop options
	 */
	public async dropForeignKey(options: DropForeignKeyOptions): Promise<void> {
		await this.query(this.getDDLBuilder().dropForeignKey(options));
	}

	/**
	 * Rename a table
	 *
	 * @param options Rename options
	 */
	public async renameTable(options: RenameTableOptions): Promise<void> {
		await this.query(this.getDDLBuilder().renameTable(options));
	}

	/**
	 * Drop a database
	 *
	 * @param options Options
	 */
	public async dropDatabase(options: DropDatabaseOptions): Promise<void> {
		await this.query(this.getDDLBuilder().dropDatabase(options));
	}

	/**
	 * Drop an existing table
	 *
	 * @param options Options
	 */
	public async dropTable(options: DropTableOptions): Promise<void> {
		await this.query(this.getDDLBuilder().dropTable(options));
	}

	/**
	 * Drop user(s)
	 *
	 * @param options Options
	 */
	public async dropUser(options: DropUserOptions): Promise<void> {
		await this.query(this.getDDLBuilder().dropUser(options));
	}

	/**
	 * Truncate an existing table
	 *
	 * @param options Options
	 */
	public async truncate(options: TruncateOptions): Promise<void> {
		await this.query(this.getDDLBuilder().truncate(options));
	}

	/**
	 * Create a new trigger
	 *
	 * @param options Trigger options
	 */
	public async createTrigger(options: TriggerOptions): Promise<void> {
		await this.query(this.getDDLBuilder().createTrigger(options));
	}

	/**
	 * Drop an existing trigger
	 *
	 * @param options Trigger options
	 */
	public async dropTrigger(options: DropTriggerOptions): Promise<void> {
		await this.query(this.getDDLBuilder().dropTrigger(options));
	}
}
