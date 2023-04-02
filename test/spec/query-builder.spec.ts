import 'jasmine';
import { and, equals, gt, gte, inArray, lt, lte, not, or } from '../../src/dml';
import { DatabaseQueryBuilder } from '../../src';
import { ColumnName } from '../../src/dml/column-name';

describe('Query Builder', () => {
	describe('Select', () => {
		it('can select', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					table: 'users',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT * FROM users');
		});

		it('can select 1 column', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users');
		});

		it('can select columns', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id', 'username'],
					table: 'users',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id, username FROM users');
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
								postId: new ColumnName('user.id'),
							},
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT * FROM post LEFT JOIN user ON (postId = user.id)'
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

			expect(sql).toEqual('SELECT * FROM post INNER JOIN user');
		});

		it('can select where', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id', 'username'],
					table: 'users',
					where: [
						{ fname: 'bob', lname: 'thompson' },
						or,
						{ fname: 'tom', lname: 'tester' },
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id, username FROM users WHERE ' +
					'((fname = ? AND lname = ?) ' +
					'OR (fname = ? AND lname = ?))'
			);
			expect(params).toEqual(['bob', 'thompson', 'tom', 'tester']);
		});

		it('can select where key/val', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { fname: 'bob', lname: 'thompson' },
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE ' + '(fname = ? AND lname = ?)'
			);
			expect(params).toEqual(['bob', 'thompson']);
		});

		it('can select where with column name', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { fname: new ColumnName('lname') },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (fname = lname)');
			expect(params).toEqual([]);
		});

		it('can select where lt', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { id: lt(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id < ?)');
			expect(params).toEqual([5]);
		});

		it('can select where lte', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { id: lte(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id <= ?)');
			expect(params).toEqual([5]);
		});

		it('can select where equals', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { id: equals(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id = ?)');
			expect(params).toEqual([5]);
		});

		it('can select where gt', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { id: gt(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id > ?)');
			expect(params).toEqual([5]);
		});

		it('can select where gte', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { id: gte(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id >= ?)');
			expect(params).toEqual([5]);
		});

		it('can select where with and', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: [{ id: gt(5) }, and, { id: lte(10) }],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE ((id > ?) AND (id <= ?))'
			);
			expect(params).toEqual([5, 10]);
		});

		it('can select where with or', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: [{ id: lt(5) }, or, { id: gt(10) }],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE ((id < ?) OR (id > ?))'
			);
			expect(params).toEqual([5, 10]);
		});

		it('can select where isNull', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { id: null },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id IS NULL)');
		});

		it('can select where boolean', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { isWorking: true },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (isWorking = ?)');
			expect(params).toEqual([true]);
		});

		it('can select where in', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { id: inArray([1, 2, 3]) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE (id IN (? , ? , ?))'
			);
			expect(params).toEqual([1, 2, 3]);
		});

		it('can select where not (key/val)', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { id: not(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id != ?)');
			expect(params).toEqual([5]);
		});

		it('can select where not (expression)', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: not({ id: 5 }),
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE !(id = ?)');
			expect(params).toEqual([5]);
		});

		it('can limit', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { fname: 'bob' },
					limit: 100,
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE (fname = ?) LIMIT 100'
			);
			expect(params).toEqual(['bob']);
		});

		it('can order by', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					table: 'users',
					where: { fname: 'bob' },
					orderBy: {
						fname: 'ASC',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE (fname = ?) ORDER BY fname ASC'
			);
			expect(params).toEqual(['bob']);
		});
	});

	describe('Insert', () => {
		it('can insert a single record', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.insert({
					table: 'users',
					records: {
						id: 1,
						fname: 'Bob',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'INSERT INTO users (`id`, `fname`) VALUES (?, ?)'
			);
			expect(params).toEqual([1, 'Bob']);
		});

		it('can insert with "on duplicate key update"', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.insert({
					table: 'users',
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
				'INSERT INTO users (`id`, `fname`) VALUES (?, ?) ON DUPLICATE KEY UPDATE fname = ?'
			);
			expect(params).toEqual([1, 'Bob', 'Tom']);
		});

		it('can insert if not already exists', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.insert({
					table: 'users',
					records: {
						id: 1,
						fname: 'Bob',
					},
					ifNotExists: true,
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'INSERT INTO users (`id`, `fname`) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = id'
			);
			expect(params).toEqual([1, 'Bob']);
		});

		it('can insert multiple records', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.insert({
					table: 'users',
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
				'INSERT INTO users (`id`, `fname`) VALUES ' + '(?, ?), (?, ?)'
			);
			expect(params).toEqual([1, 'Bob', 2, 'Tom']);
		});
	});

	describe('Update', () => {
		it('can update all records in a table', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.update({
					table: 'users',
					set: {
						fname: 'Tom',
						lname: 'Tester',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual('UPDATE users SET fname = ?, lname = ?');
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
								userId: new ColumnName('user.id'),
							},
						},
					],
					set: {
						title: 'Test Title',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'UPDATE post ' +
					'LEFT JOIN user ON (userId = user.id) ' +
					'SET title = ?'
			);
			expect(params).toEqual(['Test Title']);
		});

		it('can update where', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.update({
					table: 'users',
					set: {
						fname: 'Tom',
					},
					where: {
						fname: 'Bob',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual('UPDATE users SET fname = ? WHERE (fname = ?)');
			expect(params).toEqual(['Tom', 'Bob']);
		});
	});

	describe('Delete', () => {
		it('can delete', () => {
			const { sql, params } = new DatabaseQueryBuilder()
				.delete({
					table: 'users',
					where: {
						fname: 'Bob',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DELETE FROM users WHERE (fname = ?)');
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
								userId: new ColumnName('user.id'),
							},
						},
					],
					where: {
						fname: 'Bob',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'DELETE FROM post ' +
					'LEFT JOIN user ON (userId = user.id) ' +
					'WHERE (fname = ?)'
			);
			expect(params).toEqual(['Bob']);
		});
	});
});
