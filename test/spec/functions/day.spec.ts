import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - day()', () => {
	it('can select current day', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.day(
							DatabaseFunctions.currentTimestamp()
						),
						as: 'day',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT day(CURRENT_TIMESTAMP)  AS "day"');
		expect(params).toEqual([]);
	});

	it('can select from column name', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.day(
							columnName('create_timestamp')
						),
						as: 'day',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT day("create_timestamp")  AS "day"');
		expect(params).toEqual([]);
	});
});
