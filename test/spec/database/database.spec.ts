import 'jasmine';
import { Database, loadDatabase } from '../../../src/database';
import { QueryRepository } from '../../../src/dml';
import { User } from '../../sample-models/user';

describe('Database', () => {
	let db: Database;
	beforeAll(async () => {
		db = await loadDatabase('test/sample/database', 'main');
	});

	afterAll(async () => {
		await db.disconnect();
	});

	it('can get a query repository', () => {
		const repo = db.getQueryRepository<User>({ table: 'user' });

		expect(repo).toBeInstanceOf(QueryRepository);
	});

	it('can build the schema', async () => {
		await db.buildSchema();

		expect(await db.getSchema()).toEqual({ tables: {} });
	});
});
