import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - month()', () => {
	it('can select current month', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.month(
							DatabaseFunctions.currentTimestamp()
						),
						as: 'month',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT month(CURRENT_TIMESTAMP)  AS "month"');
		expect(params).toEqual([]);
	});

	it('can select from column name', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.month(
							columnName('created_at')
						),
						as: 'month',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT month("created_at")  AS "month"');
		expect(params).toEqual([]);
	});
});
