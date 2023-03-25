import { DatabaseDriver } from '../driver';
import { configureDb, DatabaseEnv, getDatabasePath } from './';
import { DataDefinitionRepository, QueryRepository } from '../repository';

export abstract class Database {
	public driverType: typeof DatabaseDriver;
	public driver: DatabaseDriver;

	public envType: typeof DatabaseEnv;
	public env: DatabaseEnv;

	public databasePath;
	public name = 'main';

	public query: QueryRepository;
	public ddl: DataDefinitionRepository;

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

	public configure() {
		this.env = configureDb(this.envType, this.databasePath, this.name);
	}

	public async connect() {
		if (!this.env) {
			throw new Error(
				`Cannot connect() database "${this.name}" before init()`
			);
		}
		await this.driver.connect(this.env);
	}

	public async disconnect() {
		await this.driver.disconnect();
	}
}
