import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - year()', () => {
	it('can select current year', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.year(
							DatabaseFunctions.currentTimestamp()
						),
						as: 'year',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT year(CURRENT_TIMESTAMP)  AS "year"');
		expect(params).toEqual([]);
	});

	it('can select from column name', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.year(
							columnName('create_timestamp')
						),
						as: 'year',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT year("create_timestamp")  AS "year"');
		expect(params).toEqual([]);
	});
});
