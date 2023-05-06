import { DatabaseDriver } from '../database';

export class Repository {
	protected driver: DatabaseDriver;

	public constructor(driver: DatabaseDriver) {
		this.driver = driver;
	}
}
