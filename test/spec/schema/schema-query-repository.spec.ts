import 'jasmine';
import { TestDatabaseDriver } from '../../util/driver';
import { SchemaQueryRepository } from '../../../src/schema';

describe('Schema Query Repository', () => {
	it('can get tables', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new SchemaQueryRepository({
			driver,
			database: 'riao-sample',
		});

		await repo.getTables();

		expect(driver.capturedSql).toEqual(
			'SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.tables ' +
				'WHERE (TABLE_SCHEMA = ?)'
		);

		expect(driver.capturedParams).toEqual(['riao-sample']);
	});

	it('can get the primary key', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new SchemaQueryRepository({
			driver,
			database: 'riao-sample',
		});

		await repo.getPrimaryKeyName({ table: 'user' });

		expect(driver.capturedSql).toEqual(
			'SELECT COLUMN_NAME ' +
				'FROM information_schema.columns ' +
				'WHERE (TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_KEY = ?) ' +
				'LIMIT 1'
		);

		expect(driver.capturedParams).toEqual(['riao-sample', 'user', 'PRI']);
	});

	it('can get columns', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new SchemaQueryRepository({
			driver,
			database: 'riao-sample',
		});

		await repo.getColumns({ table: 'user' });

		expect(driver.capturedSql).toEqual(
			'SELECT COLUMN_NAME FROM information_schema.columns ' +
				'WHERE (TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_KEY = ?) ' +
				'LIMIT 1; ' +
				'SELECT COLUMN_NAME, DATA_TYPE ' +
				'FROM information_schema.columns ' +
				'WHERE (TABLE_SCHEMA = ? AND TABLE_NAME = ?) ' +
				'ORDER BY ORDINAL_POSITION ASC'
		);

		expect(driver.capturedParams).toEqual([
			'riao-sample',
			'user',
			'PRI',
			'riao-sample',
			'user',
		]);
	});
});
