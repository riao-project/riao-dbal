import { Database, DatabaseEnv } from '../../src';
import { TestDatabaseDriver } from './driver';

export class TestDatabaseEnv extends DatabaseEnv {}

export class TestDatabase extends Database {
	override name = 'test';
	override driver: TestDatabaseDriver = new TestDatabaseDriver();
	override driverType = TestDatabaseDriver;
	override envType = TestDatabaseEnv;
}
