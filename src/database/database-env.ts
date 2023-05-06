import { AppConfig } from 'ts-appconfig';
import { DatabaseConnectionOptions } from './connection-options';

/**
 * Loads & stores the database's configuration.
 *
 * The configuration file should be named `database-name.db.env` and
 * 	live in the database's folder, i.e. `database/main/main.db.env`.
 * 	The .env file should be .gitignore'd!
 */
export class DatabaseEnv
	extends AppConfig
	implements DatabaseConnectionOptions {
	readonly host: string;
	readonly port: number;
	readonly username: string;
	readonly password: string;
	readonly database: string;
}
