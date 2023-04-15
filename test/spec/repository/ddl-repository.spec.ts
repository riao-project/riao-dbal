import 'jasmine';
import { ColumnType } from '../../../src';
import { DataDefinitionRepository } from '../../../src/repository';
import { TestDatabaseDriver } from '../../util/driver';

describe('DDL Repository', () => {
	it('can create a database', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new DataDefinitionRepository(driver);

		await repo.createDatabase({ name: 'mydb' });

		expect(driver.capturedSql).toEqual('CREATE DATABASE mydb');
	});

	it('can create a table', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new DataDefinitionRepository(driver);

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

	it('can drop a table', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new DataDefinitionRepository(driver);

		await repo.dropTable({
			names: 'test_table',
		});

		expect(driver.capturedSql).toEqual('DROP TABLE test_table');
	});

	it('can truncate a table', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new DataDefinitionRepository(driver);

		await repo.truncate({
			name: 'test_table',
		});

		expect(driver.capturedSql).toEqual('TRUNCATE TABLE test_table');
	});
});
