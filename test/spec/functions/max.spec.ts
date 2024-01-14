import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - max()', () => {
	it('can select from number literal', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.max(1),
						as: 'max',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT MAX(?)  AS "max"');
		expect(params).toEqual([1]);
	});

	it('can select from column name', async () => {
		const { sql } = new DatabaseQueryBuilder()
			.select({
				table: 'user',
				columns: [
					{
						query: DatabaseFunctions.max(columnName('id')),
						as: 'max',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT MAX("id")  AS "max" FROM "user"');
	});
});
