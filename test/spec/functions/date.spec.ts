import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - date()', () => {
	it('can select current date', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.date(
							DatabaseFunctions.currentTimestamp()
						),
						as: 'date',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT date(CURRENT_TIMESTAMP)  AS "date"');
		expect(params).toEqual([]);
	});

	it('can select from column name', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.date(
							columnName('created_at')
						),
						as: 'date',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT date("created_at")  AS "date"');
		expect(params).toEqual([]);
	});
});
