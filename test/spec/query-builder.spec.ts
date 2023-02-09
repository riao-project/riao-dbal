import 'jasmine';
import { and, equals, gt, gte, lt, lte, not, or } from '../../src/where';
import { DatabaseQueryBuilder } from '../../src';

describe('Query Builder', () => {
	describe('Select', () => {
		it('can select', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					from: 'users',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT * FROM users');
		});

		it('can select 1 column', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users');
		});

		it('can select columns', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id', 'username'],
					from: 'users',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id, username FROM users');
		});

		it('can select where', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id', 'username'],
					from: 'users',
					where: [
						{ fname: 'bob', lname: 'thompson' },
						or,
						{ fname: 'tom', lname: 'tester' },
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id, username FROM users WHERE ' +
					'((fname = "bob" AND lname = "thompson") ' +
					'OR (fname = "tom" AND lname = "tester"))'
			);
		});

		it('can select where key/val', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { fname: 'bob', lname: 'thompson' },
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE ' +
					'(fname = "bob" AND lname = "thompson")'
			);
		});

		it('can select where lt', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { id: lt(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id < 5)');
		});

		it('can select where lte', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { id: lte(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id <= 5)');
		});

		it('can select where equals', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { id: equals(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id = 5)');
		});

		it('can select where gt', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { id: gt(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id > 5)');
		});

		it('can select where gte', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { id: gte(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id >= 5)');
		});

		it('can select where with and', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: [{ id: gt(5) }, and, { id: lte(10) }],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE ((id > 5) AND (id <= 10))'
			);
		});

		it('can select where with or', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: [{ id: lt(5) }, or, { id: gt(10) }],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE ((id < 5) OR (id > 10))'
			);
		});

		it('can select where isNull', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { id: null },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id IS NULL)');
		});

		it('can select where boolean', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { isWorking: true },
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'SELECT id FROM users WHERE (isWorking = true)'
			);
		});

		it('can select where not (key/val)', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: { id: not(5) },
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE (id != 5)');
		});

		it('can select where not (expression)', () => {
			const { sql } = new DatabaseQueryBuilder()
				.select({
					columns: ['id'],
					from: 'users',
					where: not({ id: 5 }),
				})
				.toDatabaseQuery();

			expect(sql).toEqual('SELECT id FROM users WHERE !(id = 5)');
		});
	});
});
