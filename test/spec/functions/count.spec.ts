import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';
import { gt } from '../../../src/comparison';

describe('Function - count()', () => {
	it('can count records', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.count(),
						as: 'count',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT COUNT(*) AS "count"');
		expect(params).toEqual([]);
	});

	it('can count distinct', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.count({ distinct: true }),
						as: 'count',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT COUNT(DISTINCT *) AS "count"');
		expect(params).toEqual([]);
	});

	it('can count column', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.count({
							column: 'id',
						}),
						as: 'count',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT COUNT("id") AS "count"');
		expect(params).toEqual([]);
	});

	it('can count expression', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.count({
							expr: [columnName('id'), gt(5)],
						}),
						as: 'count',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT COUNT(("id"> ?) ) AS "count"');
		expect(params).toEqual([5]);
	});

	it('can count distinct column', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.count({
							distinct: true,
							column: 'id',
						}),
						as: 'count',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT COUNT(DISTINCT "id") AS "count"');
		expect(params).toEqual([]);
	});
});
