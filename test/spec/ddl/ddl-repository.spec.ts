import 'jasmine';
import { ColumnType } from '../../../src';
import { TestDatabase } from '../../util/database';

describe('DDL Repository', () => {
	it('can create a database', async () => {
		const db = new TestDatabase();
		const repo = db.getDataDefinitionRepository();
		const driver = db.driver;

		await repo.createDatabase({ name: 'mydb' });

		expect(driver.capturedSql).toEqual('CREATE DATABASE mydb');
	});

	it('can create a table', async () => {
		const db = new TestDatabase();
		const repo = db.getDataDefinitionRepository();
		const driver = db.driver;

		await repo.createTable({
			name: 'test_table',
			columns: [
				{
					name: 'id',
					type: ColumnType.INT,
				},
			],
		});

		expect(driver.capturedSql).toEqual('CREATE TABLE test_table (id INT)');
	});

	it('can create a user', async () => {
		const db = new TestDatabase();
		const repo = db.getDataDefinitionRepository();
		const driver = db.driver;

		await repo.createUser({ name: 'test_user' });

		expect(driver.capturedSql).toEqual('CREATE USER test_user');
	});

	it('can drop a table', async () => {
		const db = new TestDatabase();
		const repo = db.getDataDefinitionRepository();
		const driver = db.driver;

		await repo.dropTable({
			tables: 'test_table',
		});

		expect(driver.capturedSql).toEqual('DROP TABLE test_table');
	});

	it('can drop a user', async () => {
		const db = new TestDatabase();
		const repo = db.getDataDefinitionRepository();
		const driver = db.driver;

		await repo.dropUser({
			names: 'test_user',
		});

		expect(driver.capturedSql).toEqual('DROP USER test_user');
	});

	it('can truncate a table', async () => {
		const db = new TestDatabase();
		const repo = db.getDataDefinitionRepository();
		const driver = db.driver;

		await repo.truncate({
			table: 'test_table',
		});

		expect(driver.capturedSql).toEqual('TRUNCATE TABLE test_table');
	});
});
