import { DatabaseDriver } from '../database';
import { DatabaseFunctions } from '../functions';

export interface RepositoryOptions {
	functions: DatabaseFunctions;
}

export interface RepositoryInit {
	driver: DatabaseDriver;
}
