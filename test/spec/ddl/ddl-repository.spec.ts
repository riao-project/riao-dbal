import 'jasmine';
import { ColumnType, DataDefinitionRepository } from '../../../src';
import { TestDatabase } from '../../util/database';
import { TestDatabaseDriver } from '../../util/driver';

async function mockDb(): Promise<{
	repo: DataDefinitionRepository;
	driver: TestDatabaseDriver;
}> {
	const db = new TestDatabase();
	await db.init();

	return { repo: db.getDataDefinitionRepository(), driver: db.driver };
}

describe('DDL Repository', () => {
	it('can create a database', async () => {
		const { repo, driver } = await mockDb();

		await repo.createDatabase({ name: 'mydb' });

		expect(driver.capturedSql).toEqual('CREATE DATABASE mydb');
	});

	it('can create a table', async () => {
		const { repo, driver } = await mockDb();

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
		const { repo, driver } = await mockDb();

		await repo.createUser({ name: 'test_user' });

		expect(driver.capturedSql).toEqual('CREATE USER test_user');
	});

	it('can drop a table', async () => {
		const { repo, driver } = await mockDb();

		await repo.dropTable({
			tables: 'test_table',
		});

		expect(driver.capturedSql).toEqual('DROP TABLE test_table');
	});

	it('can drop a user', async () => {
		const { repo, driver } = await mockDb();

		await repo.dropUser({
			names: 'test_user',
		});

		expect(driver.capturedSql).toEqual('DROP USER test_user');
	});

	it('can truncate a table', async () => {
		const { repo, driver } = await mockDb();

		await repo.truncate({
			table: 'test_table',
		});

		expect(driver.capturedSql).toEqual('TRUNCATE TABLE test_table');
	});
});
