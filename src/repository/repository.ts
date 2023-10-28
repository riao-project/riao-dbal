import { DatabaseDriver } from '../database';
import { DatabaseFunctions } from '../functions';
import { RepositoryInit, RepositoryOptions } from './repository-options';

export class Repository {
	protected driver: DatabaseDriver;
	protected functions: DatabaseFunctions;

	public constructor(options: RepositoryOptions) {
		this.functions = options.functions;
	}

	public init(options: RepositoryInit) {
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
