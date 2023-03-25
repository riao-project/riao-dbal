import 'jasmine';
import {
	DataDefinitionRepository,
	loadDatabase,
	QueryRepository,
} from '../../../src/';

describe('loadDatabase()', () => {
	it('can load a database from a folder', async () => {
		const db = await loadDatabase('test/sample/database', 'main');

		expect(db.env.port).toEqual(3307);
		expect(db.ddl).toBeInstanceOf(DataDefinitionRepository);
		expect(db.query).toBeInstanceOf(QueryRepository);

		await db.disconnect();
	});
});
