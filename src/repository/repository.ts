import { DatabaseDriver } from '../database';
import { RepositoryOptions } from './repository-options';

export class Repository {
	protected driver: DatabaseDriver;

	public constructor(options: RepositoryOptions) {
		this.setDriver(options.driver);
	}

	/**
	 * Set the repository driver to run queries on
	 *
	 * @param driver Driver to set
	 */
	public setDriver(driver: DatabaseDriver): void {
		this.driver = driver;
	}
}
