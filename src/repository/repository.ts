import {
	DatabaseDriver,
	DatabaseQueryOptions,
	DatabaseQueryResult,
} from '../database';
import { RepositoryInit, RepositoryOptions } from './repository-options';

export class Repository {
	protected driver: DatabaseDriver;
	protected isReady = null;

	public constructor(options: RepositoryOptions) {}

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

	/**
	 * Check if the database is ready, and throw an error if it's not
	 */
	public readyCheck(): void {
		if (this.isReady === null) {
			throw new Error('Cannot query repository before database init()');
		}
		else if (this.isReady === false) {
			throw new Error(
				'Cannot query repository because database init() failed'
			);
		}
	}

	/**
	 * Check & query the database
	 *
	 * @param query Query to run
	 */
	public async query(
		query: DatabaseQueryOptions
	): Promise<DatabaseQueryResult> {
		this.readyCheck();

		return this.driver.query(query);
	}
}
