import 'jasmine';
import { ColumnType } from '../../src/column-type';
import { DataDefinitionBuilder } from '../../src/ddl-builder';

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
});
