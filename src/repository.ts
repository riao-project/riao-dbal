import { DatabaseDriver } from './driver';

export class Repository {
	protected driver: DatabaseDriver;

	public constructor(driver: DatabaseDriver) {
		this.driver = driver;
	}
}
