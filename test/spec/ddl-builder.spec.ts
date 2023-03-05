import 'jasmine';
import { ColumnType } from '../../src/column-type';
import { DataDefinitionBuilder } from '../../src/ddl';

describe('DDL Builder', () => {
	describe('Create Table', () => {
		it('can create a table', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'id',
							type: ColumnType.INT,
						},
						{
							name: 'fname',
							type: ColumnType.VARCHAR,
							length: 128,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE user (id INT, fname VARCHAR(128))'
			);
		});

		it('can create table if not exists', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					ifNotExists: true,
					columns: [
						{
							name: 'fname',
							type: ColumnType.VARCHAR,
							length: 128,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE IF NOT EXISTS user (fname VARCHAR(128))'
			);
		});

		it('can create an auto-incrementing primary key', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'id',
							type: ColumnType.BIGINT,
							primaryKey: true,
							autoIncrement: true,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE user (id BIGINT AUTO_INCREMENT, PRIMARY KEY (id))'
			);
		});

		it('can create decimal column', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'balance',
							type: ColumnType.DECIMAL,
							significant: 2,
							decimal: 2,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual('CREATE TABLE user (balance DECIMAL(2, 2))');
		});

		it('can create an enum column', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'choice',
							type: ColumnType.ENUM,
							enum: ['A', 'B'],
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual('CREATE TABLE user (choice ENUM(\'A\', \'B\'))');
		});
	});

	describe('Drop Table', () => {
		it('can drop a table', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropTable({
					names: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP TABLE user');
		});

		it('can drop multiple tables', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropTable({
					names: ['user', 'test'],
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP TABLE user,test');
		});

		it('can drop a table if exists', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropTable({
					names: 'user',
					ifExists: true,
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP TABLE IF EXISTS user');
		});
	});

	describe('Truncate', () => {
		it('can truncate a table', () => {
			const { sql } = new DataDefinitionBuilder()
				.truncate({ name: 'user' })
				.toDatabaseQuery();

			expect(sql).toEqual('TRUNCATE user');
		});
	});
});
