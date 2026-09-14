import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - round()', () => {
	it('can select from number literal', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.round(1.5),
						as: 'round',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT ROUND(?)  AS "round"');
		expect(params).toEqual([1.5]);
	});

	it('can select from column name', async () => {
		const { sql } = new DatabaseQueryBuilder()
			.select({
				table: 'user',
				columns: [
					{
						query: DatabaseFunctions.round(columnName('score')),
						as: 'round',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT ROUND("score")  AS "round" FROM "user"');
	});

	it('can select with decimal places', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.round(1.567, 2),
						as: 'round',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT ROUND(?, 2)  AS "round"');
		expect(params).toEqual([1.567]);
	});
});
