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

		it('can create a default value', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'created_at',
							type: ColumnType.DATETIME,
							default: 'now()',
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE user (created_at DATETIME DEFAULT now())'
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

		it('can create foreign key constraints', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'post',
					columns: [
						{
							name: 'userId',
							type: ColumnType.INT,
						},
					],
					foreignKeys: [
						{
							columns: ['userId'],
							referencesTable: 'user',
							referencesColumns: ['id'],
							onUpdate: 'CASCADE',
							onDelete: 'RESTRICT',
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE post (userId INT, ' +
					'CONSTRAINT fk_post_userId ' +
					'FOREIGN KEY (userId) ' +
					'REFERENCES user(id) ' +
					'ON UPDATE CASCADE ' +
					'ON DELETE RESTRICT' +
					')'
			);
		});
	});

	describe('Alter Table', () => {
		it('can add columns', () => {
			const { sql } = new DataDefinitionBuilder()
				.addColumns({
					table: 'user',
					columns: [
						{
							name: 'fname',
							type: ColumnType.VARCHAR,
							length: 255,
						},
						{
							name: 'lname',
							type: ColumnType.VARCHAR,
							length: 255,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'ALTER TABLE user ' +
					'ADD fname VARCHAR(255), lname VARCHAR(255)'
			);
		});

		it('can add foreign keys', () => {
			const { sql } = new DataDefinitionBuilder()
				.addForeignKey({
					table: 'post',
					fk: {
						columns: ['userId'],
						referencesTable: 'user',
						referencesColumns: ['id'],
						onUpdate: 'CASCADE',
						onDelete: 'RESTRICT',
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'ALTER TABLE post ' +
					'ADD CONSTRAINT fk_post_userId ' +
					'FOREIGN KEY (userId) ' +
					'REFERENCES user(id) ' +
					'ON UPDATE CASCADE ' +
					'ON DELETE RESTRICT'
			);
		});

		it('can change a column', () => {
			const { sql } = new DataDefinitionBuilder()
				.changeColumn({
					table: 'user',
					column: 'email',
					options: {
						name: 'email',
						type: ColumnType.VARCHAR,
						length: 1024,
					},
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'ALTER TABLE user CHANGE COLUMN email email VARCHAR(1024)'
			);
		});

		it('can drop a column', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropColumn({
					table: 'user',
					column: 'email',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('ALTER TABLE user DROP COLUMN email');
		});

		it('can drop a foreign key constraint', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropForeignKey({
					table: 'user',
					fk: 'fk_post_userId',
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'ALTER TABLE user DROP FOREIGN KEY fk_post_userId'
			);
		});

		it('can rename a column', () => {
			const { sql } = new DataDefinitionBuilder()
				.renameColumn({
					table: 'user',
					from: 'email',
					to: 'email_address',
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'ALTER TABLE user RENAME COLUMN email TO email_address'
			);
		});

		it('can rename a table', () => {
			const { sql } = new DataDefinitionBuilder()
				.renameTable({
					table: 'user',
					to: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('ALTER TABLE user RENAME user');
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

			expect(sql).toEqual('TRUNCATE TABLE user');
		});
	});
});
