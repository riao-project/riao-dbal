import 'jasmine';
import {
	and,
	columnName,
	equals,
	gt,
	gte,
	inArray,
	like,
	lt,
	lte,
	not,
	or,
} from '../../../src/dml';
import { DatabaseQueryBuilder } from '../../../src';

describe('Query Builder', () => {
	describe('Select', () => {
		it('can select', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					table: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT * FROM "user"');
		});

		it('can select 1 column', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user"');
		});

		it('can select columns', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id', 'username'],
					table: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id, username FROM "user"');
		});

		it('can select columns as', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: [
						{
							column: 'id',
							as: 'user_id',
						},
						{
							column: 'username',
							as: 'user_username',
						},
					],
					table: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id AS user_id, username AS user_username FROM "user"'
			);
		});

		it('can select columns from subquery', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: [
						{
							query: {
								columns: ['id'],
								table: 'user',
								where: { id: 1 },
							},
							as: 'first_id',
						},
						{
							query: {
								columns: ['email'],
								table: 'user',
								where: { id: 2 },
							},
							as: 'second_email',
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT (SELECT id FROM "user" WHERE (id = ?)) AS first_id, ' +
					'(SELECT email FROM "user" WHERE (id = ?)) AS second_email'
			);
		});

		it('can left join', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					table: 'post',
					join: [
						{
							type: 'LEFT',
							table: 'user',
							on: {
								postId: columnName('user.id'),
							},
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT * FROM "post" LEFT JOIN "user" ON (postId = user.id)'
			);
		});

		it('can inner join', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					table: 'post',
					join: [
						{
							type: 'INNER',
							table: 'user',
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT * FROM "post" INNER JOIN "user"');
		});

		it('can select where', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id', 'username'],
					table: 'user',
					where: [
						{ fname: 'bob', lname: 'thompson' },
						or,
						{ fname: 'tom', lname: 'tester' },
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id, username FROM "user" WHERE ' +
					'((fname = ? AND lname = ?) ' +
					'OR (fname = ? AND lname = ?))'
			);
			expect(params).toEqual(['bob', 'thompson', 'tom', 'tester']);
		});

		it('can select where key/val', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { fname: 'bob', lname: 'thompson' },
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM "user" WHERE ' + '(fname = ? AND lname = ?)'
			);
			expect(params).toEqual(['bob', 'thompson']);
		});

		it('can select where with column name', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { fname: columnName('lname') },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (fname = lname)');
			expect(params).toEqual([]);
		});

		it('can select where lt', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { id: lt(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (id < ?)');
			expect(params).toEqual([5]);
		});

		it('can select where lte', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { id: lte(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (id <= ?)');
			expect(params).toEqual([5]);
		});

		it('can select where equals', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { id: equals(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (id = ?)');
			expect(params).toEqual([5]);
		});

		it('can select where like', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { name: like('%bob%') },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (name LIKE ?)');
			expect(params).toEqual(['%bob%']);
		});

		it('can select where gt', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { id: gt(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (id > ?)');
			expect(params).toEqual([5]);
		});

		it('can select where gte', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { id: gte(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (id >= ?)');
			expect(params).toEqual([5]);
		});

		it('can select where with and', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: [{ id: gt(5) }, and, { id: lte(10) }],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM "user" WHERE ((id > ?) AND (id <= ?))'
			);
			expect(params).toEqual([5, 10]);
		});

		it('can select where with or', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: [{ id: lt(5) }, or, { id: gt(10) }],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM "user" WHERE ((id < ?) OR (id > ?))'
			);
			expect(params).toEqual([5, 10]);
		});

		it('can select where isNull', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { id: null },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (id IS NULL)');
		});

		it('can select where false', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					table: 'user',
					where: { id: false },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT * FROM "user" WHERE (id = ?)');
			expect(params).toEqual([false]);
		});

		it('can select where true', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { isWorking: true },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (isWorking = ?)');
			expect(params).toEqual([true]);
		});

		it('can select where in', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { id: inArray([1, 2, 3]) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM "user" WHERE (id IN (? , ? , ?))'
			);
			expect(params).toEqual([1, 2, 3]);
		});

		it('can select where not (key/val)', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { id: not(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE (id != ?)');
			expect(params).toEqual([5]);
		});

		it('can select where not (expression)', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: not({ id: 5 }),
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM "user" WHERE !(id = ?)');
			expect(params).toEqual([5]);
		});

		it('can select where not like', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: {
						name: not(like('tom')),
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM "user" WHERE (name NOT LIKE ?)'
			);
			expect(params).toEqual(['tom']);
		});

		it('can select where not in array', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: {
						name: not(inArray(['tom', 'bob'])),
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM "user" WHERE (name NOT IN (? , ?))'
			);
			expect(params).toEqual(['tom', 'bob']);
		});

		it('can limit', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { fname: 'bob' },
					limit: 100,
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM "user" WHERE (fname = ?) LIMIT 100'
			);
			expect(params).toEqual(['bob']);
		});

		it('can order by', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'user',
					where: { fname: 'bob' },
					orderBy: {
						fname: 'ASC',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM "user" WHERE (fname = ?) ORDER BY fname ASC'
			);
			expect(params).toEqual(['bob']);
		});
	});

	describe('Insert', () => {
		it('can insert a single record', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.insert({
					table: 'user',
					records: {
						id: 1,
						fname: 'Bob',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual('INSERT INTO "user" (id, fname) VALUES (?, ?)');
			expect(params).toEqual([1, 'Bob']);
		});

		it('can insert with "on duplicate key update"', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.insert({
					table: 'user',
					records: {
						id: 1,
						fname: 'Bob',
					},
					onDuplicateKeyUpdate: {
						fname: 'Tom',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'INSERT INTO "user" (id, fname) VALUES (?, ?) ON DUPLICATE KEY UPDATE fname = ?'
			);
			expect(params).toEqual([1, 'Bob', 'Tom']);
		});

		it('can insert if not already exists', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.insert({
					table: 'user',
					records: {
						id: 1,
						fname: 'Bob',
					},
					ifNotExists: true,
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'INSERT INTO "user" (id, fname) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id'
			);
			expect(params).toEqual([1, 'Bob']);
		});

		it('can insert multiple records', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.insert({
					table: 'user',
					records: [
						{
							id: 1,
							fname: 'Bob',
						},
						{
							id: 2,
							fname: 'Tom',
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'INSERT INTO "user" (id, fname) VALUES ' + '(?, ?), (?, ?)'
			);
			expect(params).toEqual([1, 'Bob', 2, 'Tom']);
		});
	});

	describe('Update', () => {
		it('can update all records in a table', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.update({
					table: 'user',
					set: {
						fname: 'Tom',
						lname: 'Tester',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual('UPDATE "user" SET fname = ?, lname = ?');
			expect(params).toEqual(['Tom', 'Tester']);
		});

		it('can update with join', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.update({
					table: 'post',
					join: [
						{
							table: 'user',
							type: 'LEFT',
							on: {
								userId: columnName('user.id'),
							},
						},
					],
					set: {
						title: 'Test Title',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'UPDATE "post" ' +
					'LEFT JOIN "user" ON (userId = user.id) ' +
					'SET title = ?'
			);
			expect(params).toEqual(['Test Title']);
		});

		it('can update where', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.update({
					table: 'user',
					set: {
						fname: 'Tom',
					},
					where: {
						fname: 'Bob',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'UPDATE "user" SET fname = ? WHERE (fname = ?)'
			);
			expect(params).toEqual(['Tom', 'Bob']);
		});
	});

	describe('Delete', () => {
		it('can delete', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.delete({
					table: 'user',
					where: {
						fname: 'Bob',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DELETE FROM "user" WHERE (fname = ?)');
			expect(params).toEqual(['Bob']);
		});

		it('can delete with join', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.delete({
					table: 'post',
					join: [
						{
							type: 'LEFT',
							table: 'user',
							on: {
								userId: columnName('user.id'),
							},
						},
					],
					where: {
						fname: 'Bob',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'DELETE FROM "post" ' +
					'LEFT JOIN "user" ON (userId = user.id) ' +
					'WHERE (fname = ?)'
			);
			expect(params).toEqual(['Bob']);
		});
	});
});
