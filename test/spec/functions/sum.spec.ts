import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - sum()', () => {
	it('can select from number literal', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.sum(1),
						as: 'sum',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT SUM(?)  AS "sum"');
		expect(params).toEqual([1]);
	});

	it('can select from column name', async () => {
		const { sql } = new DatabaseQueryBuilder()
			.select({
				table: 'user',
				columns: [
					{
						query: DatabaseFunctions.sum(columnName('id')),
						as: 'sum',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT SUM("id")  AS "sum" FROM "user"');
	});
});
