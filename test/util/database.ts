import { Database, DatabaseEnv } from '../../src/database';
import { TestDatabaseDriver } from './driver';

export class TestDatabaseEnv extends DatabaseEnv {}

export class TestDatabase extends Database {
	driverType = TestDatabaseDriver;
	envType = TestDatabaseEnv;
}
