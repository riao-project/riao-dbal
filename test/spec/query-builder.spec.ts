import 'jasmine';
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
	});
});
