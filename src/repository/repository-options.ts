import { DatabaseDriver } from '../database';

export interface RepositoryOptions {}

export interface RepositoryInit {
	driver: DatabaseDriver;
}
