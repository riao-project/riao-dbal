import 'jasmine';
import { Database, loadAll } from '../../../src/';

describe('database/loadAll()', () => {
	it('can load all databases', async () => {
		const databases = await loadAll('test/sample/database');
		expect(databases.main).toBeInstanceOf(Database);
	});
});
