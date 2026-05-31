import 'jasmine';
import { DatabaseFunctions } from '../../../src/functions';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { columnName } from '../../../src/tokens';

describe('Function - concat()', () => {
	it('can select concatenated values', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				columns: [
					{
						query: DatabaseFunctions.concat('hello', ' ', 'world'),
						as: 'message',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual('SELECT CONCAT(? , ? , ?)  AS "message"');
		expect(params).toEqual(['hello', ' ', 'world']);
	});

	it('can select concatenated columns and values', async () => {
		const { sql, params } = new DatabaseQueryBuilder()
			.select({
				table: 'user',
				columns: [
					{
						query: DatabaseFunctions.concat(
							columnName('first_name'),
							' ',
							columnName('last_name')
						),
						as: 'full_name',
					},
				],
			})
			.toDatabaseQuery();

		expect(sql).toEqual(
			'SELECT CONCAT("first_name", ? , "last_name") ' +
				' AS "full_name" FROM "user"'
		);
		expect(params).toEqual([' ']);
	});
});
