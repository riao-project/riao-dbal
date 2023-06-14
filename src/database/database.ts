import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join as joinPath } from 'path';
import { DatabaseDriver } from './driver';
import { configureDb, DatabaseEnv } from '../config';
import { getDatabasePath } from './get-database-path';
import { DataDefinitionBuilder, DataDefinitionRepository } from '../ddl';
import { DatabaseConnectionOptions } from './connection-options';
import { DatabaseRecord } from '../record';
import {
	DatabaseQueryBuilder,
	QueryRepository,
	QueryRepositoryOptions,
} from '../dml';
import { SchemaQueryRepository } from '../schema/schema-query-repository';
import { Schema } from '../schema';

/**
 * Represents a single database instance, including a driver,
 * 	configuration, connection, etc.
 */
export abstract class Database {
	/**
	 * Database driver class
	 */
	public driverType: typeof DatabaseDriver;

	/**
	 * Database driver intance
	 */
	public driver: DatabaseDriver;

	/**
	 * Database configuration class
	 */
	public envType: typeof DatabaseEnv;

	/**
	 * Database configuration
	 */
	public env: DatabaseEnv;

	/**
	 * Parent path (database path)
	 */
	public databasePath;

	/**
	 * Database name (must match folder name!)
	 */
	public name;

	/**
	 * Migrations directory, relative to this database
	 * 	e.g. If the migrations are in `database/main/migrations`,
	 * 	set this to `migrations`
	 */
	public migrations = 'migrations';

	/**
	 * Seeds directory, relative to this database
	 * 	e.g. If the seeds are in `database/main/seeds`,
	 * 	set this to `seeds`
	 */
	public seeds = 'seeds';

	/**
	 * Schema storage directory, relative to this database
	 * 	e.g. If the schema is in `database/main/.schema`,
	 * 	set this to `.schema`
	 */
	public schemaDirectory = '.schema';

	/**
	 * Query builder class type used to create new query builders
	 */
	public queryBuilderType: typeof DatabaseQueryBuilder = DatabaseQueryBuilder;

	/**
	 * Query repository class type used to create new repos
	 */
	public queryRepositoryType: typeof QueryRepository = QueryRepository;

	/**
	 * Query repository
	 */
	public query: QueryRepository;

	/**
	 * DDL builder class type used to create new builders
	 */
	public ddlBuilderType: typeof DataDefinitionBuilder = DataDefinitionBuilder;

	/**
	 * DDL repository class type used to create new repos
	 */
	public ddlRepositoryType: typeof DataDefinitionRepository =
		DataDefinitionRepository;

	/**
	 * Data definition repository
	 */
	public ddl: DataDefinitionRepository;

	/**
	 * Schema Query repository class type used to create new repos
	 */
	public schemaQueryRepositoryType: typeof SchemaQueryRepository =
		SchemaQueryRepository;

	/**
	 * Schema query repository
	 */
	public schemaQuery: SchemaQueryRepository;

	/**
	 * Database schema
	 */
	protected schema: Schema;

	/**
	 * Initialize the database
	 *
	 * @param options Database options
	 */
	public async init(options?: {
		connectionOptions?: DatabaseConnectionOptions;
	}): Promise<void> {
		options = options ?? {};

		if (!this.name) {
			throw new Error('Cannot load database without a name');
		}

		if (!this.databasePath) {
			this.databasePath = getDatabasePath();
		}

		if (!this.driver) {
			this.driver = new this.driverType();
		}

		if (options.connectionOptions) {
			this.env = <DatabaseEnv>options.connectionOptions;
		}
		else {
			this.configureFromEnv();
		}

		await this.connect();

		this.schemaQuery = this.getSchemaQueryRepository();
		await this.loadSchema();

		this.query = this.getQueryRepository();
		this.ddl = this.getDataDefinitionRepository();
	}

	/**
	 * Load the configuration .env
	 */
	public configureFromEnv() {
		this.env = configureDb(this.envType, this.databasePath, this.name);
	}

	/**
	 * Connect to the database
	 */
	public async connect() {
		if (!this.env) {
			throw new Error(
				`Cannot connect() database "${this.name}" before init()`
			);
		}
		await this.driver.connect(this.env);
	}

	/**
	 * Disconnect from the database
	 */
	public async disconnect() {
		await this.driver.disconnect();
	}

	/**
	 * Get the full relative path to this database's migrations folder
	 *
	 * @returns Returns the relative file path
	 */
	public getMigrationsDirectory(): string {
		return joinPath(this.databasePath, this.name, this.migrations);
	}

	/**
	 * Get the full relative path to this database's seeds folder
	 *
	 * @returns Returns the relative file path
	 */
	public getSeedsDirectory(): string {
		return joinPath(this.databasePath, this.name, this.seeds);
	}

	/**
	 * Get the full relative path to this database's schema folder
	 *
	 * @returns Returns the relative file path
	 */
	public getSchemaDirectory(): string {
		return joinPath(this.databasePath, this.name, this.schemaDirectory);
	}

	/**
	 * Get a new DDL repository
	 *
	 * @param options Repository options
	 * @returns Returns the DDL repository
	 */
	public getDataDefinitionRepository() {
		if (!this.driver) {
			this.driver = new this.driverType();
		}

		return new this.ddlRepositoryType({
			driver: this.driver,
			ddlBuilderType: this.ddlBuilderType,
		});
	}

	/**
	 * Get a new query repository
	 *
	 * @param options Repository options
	 * @returns Returns the query repository
	 */
	public getQueryRepository<T extends DatabaseRecord = DatabaseRecord>(
		options?: Omit<QueryRepositoryOptions, 'driver' | 'queryBuilderType'>
	): QueryRepository<T> {
		if (!this.driver) {
			this.driver = new this.driverType();
		}

		return new this.queryRepositoryType<T>({
			...(options ?? {}),
			driver: this.driver,
			schema: this.schema,
			queryBuilderType: this.queryBuilderType,
		});
	}

	/**
	 * Get a new schema query repository
	 *
	 * @returns Schema Query Repository
	 */
	public getSchemaQueryRepository(): SchemaQueryRepository {
		if (!this.driver) {
			this.driver = new this.driverType();
		}

		return new this.schemaQueryRepositoryType({
			driver: this.driver,
			database: this.env.database,
			queryBuilderType: this.queryBuilderType,
		});
	}

	/**
	 * Build & save the database schema
	 */
	public async buildSchema() {
		this.schema = await this.schemaQuery.getSchema();
		await this.saveSchema();
	}

	/**
	 * Save the database schema
	 */
	public async saveSchema(): Promise<void> {
		mkdirSync(this.getSchemaDirectory(), { recursive: true });
		const filepath = joinPath(this.getSchemaDirectory(), 'schema.json');
		const data = JSON.stringify(this.schema);

		writeFileSync(filepath, data);
	}

	/**
	 * Load the database schema
	 */
	public async loadSchema(): Promise<void> {
		const filepath = joinPath(this.getSchemaDirectory(), 'schema.json');

		if (existsSync(filepath)) {
			const data = readFileSync(filepath).toString();

			this.schema = JSON.parse(data);
		}
		else {
			await this.buildSchema();
		}
	}

	/**
	 * Get schema metadata
	 *
	 * @returns Schema
	 */
	public async getSchema(): Promise<Schema> {
		if (!this.schema) {
			await this.loadSchema();
		}

		return this.schema;
	}
}
