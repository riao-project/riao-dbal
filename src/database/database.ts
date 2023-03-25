import { join as joinPath } from 'path';
import { DatabaseDriver } from '../driver';
import { configureDb, DatabaseEnv, getDatabasePath } from './';
import { DataDefinitionRepository, QueryRepository } from '../repository';

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
	public name = 'main';

	/**
	 * Migrations directory, relative to this database
	 * 	e.g. If the migrations are in `database/main/migrations`,
	 * 	set this to `migrations`
	 */
	public migrations = 'migrations';

	/**
	 * Query repository
	 */
	public query: QueryRepository;

	/**
	 * Data definition repository
	 */
	public ddl: DataDefinitionRepository;

	/**
	 * Initialize the database
	 *
	 * @param connect Connect now? (Default connects on initialization)
	 */
	public async init(connect = true): Promise<void> {
		if (!this.databasePath) {
			this.databasePath = getDatabasePath();
		}

		this.driver = new this.driverType();
		this.configure();

		this.query = new QueryRepository(this.driver);
		this.ddl = new DataDefinitionRepository(this.driver);

		if (connect) {
			await this.connect();
		}
	}

	/**
	 * Load the configuration .env
	 */
	public configure() {
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
}
