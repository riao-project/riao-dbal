import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - average()', () => {
	it('can select from number literal', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.average(1),
						as: 'average',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT AVG(?)  AS "average"');
		expect(params).toEqual([1]);
	});

	it('can select from column name', async () => {
		const { sql } = new DatabaseQueryBuilder()
			.select({
				table: 'user',
				columns: [
					{
						query: DatabaseFunctions.average(columnName('id')),
						as: 'average',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT AVG("id")  AS "average" FROM "user"');
	});
});
