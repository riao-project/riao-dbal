import { AppConfig } from 'ts-appconfig';
import { DatabaseConnectionOptions } from '../connection-options';

export class DatabaseEnv
	extends AppConfig
	implements DatabaseConnectionOptions {
	readonly host: string;
	readonly port: number;
	readonly username: string;
	readonly password: string;
	readonly database: string;
}
