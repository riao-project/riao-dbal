import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - min()', () => {
	it('can select from number literal', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.min(1),
						as: 'min',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT MIN(?)  AS "min"');
		expect(params).toEqual([1]);
	});

	it('can select from column name', async () => {
		const { sql } = new DatabaseQueryBuilder()
			.select({
				table: 'user',
				columns: [
					{
						query: DatabaseFunctions.min(columnName('id')),
						as: 'min',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT MIN("id")  AS "min" FROM "user"');
	});
});
