import { DatabaseDriver } from '../database';
import { RepositoryOptions } from './repository-options';

export class Repository {
	protected driver: DatabaseDriver;

	public constructor(options: RepositoryOptions) {
		this.driver = options.driver;
	}
}
