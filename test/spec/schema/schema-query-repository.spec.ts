import 'jasmine';
import { TestDatabase } from '../../util/database';
import { SchemaQueryRepository } from '../../../src';

async function mockDb(): Promise<{
	db: TestDatabase;
	repo: SchemaQueryRepository;
}> {
	const db = new TestDatabase();
	await db.init();
	db.env = <any>{ database: 'riao-sample' };

	return {
		db,
		repo: db.getSchemaQueryRepository(),
	};
}

describe('Schema Query Repository', () => {
	it('can get tables', async () => {
		const { db, repo } = await mockDb();

		await repo.getTables();

		expect(db.driver.capturedSql).toEqual(
			'SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.tables ' +
				'WHERE (TABLE_SCHEMA = ?)'
		);

		expect(db.driver.capturedParams).toEqual(['riao-sample']);
	});

	it('can get the primary key', async () => {
		const { db, repo } = await mockDb();

		await repo.getPrimaryKeyName({ table: 'user' });

		expect(db.driver.capturedSql).toEqual(
			'SELECT COLUMN_NAME ' +
				'FROM information_schema.columns ' +
				'WHERE (TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_KEY = ?) ' +
				'LIMIT 1'
		);

		expect(db.driver.capturedParams).toEqual([
			'riao-sample',
			'user',
			'PRI',
		]);
	});

	it('can get columns', async () => {
		const { db, repo } = await mockDb();

		await repo.getColumns({ table: 'user' });

		expect(db.driver.capturedSql).toEqual(
			'SELECT COLUMN_NAME FROM information_schema.columns ' +
				'WHERE (TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_KEY = ?) ' +
				'LIMIT 1; ' +
				'SELECT COLUMN_NAME, DATA_TYPE ' +
				'FROM information_schema.columns ' +
				'WHERE (TABLE_SCHEMA = ? AND TABLE_NAME = ?) ' +
				'ORDER BY ORDINAL_POSITION ASC'
		);

		expect(db.driver.capturedParams).toEqual([
			'riao-sample',
			'user',
			'PRI',
			'riao-sample',
			'user',
		]);
	});
});
