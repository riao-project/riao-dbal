import 'jasmine';
import { ColumnType } from '../../../src/column';
import { DataDefinitionBuilder } from '../../../src/ddl';
import { DatabaseFunctions } from '../../../src/functions';

describe('DDL Builder', () => {
	describe('Constraint Checks', () => {
		it('can disable constraint checks', () => {
			const { sql } = new DataDefinitionBuilder()
				.disableForeignKeyChecks()
				.toDatabaseQuery();

			expect(sql).toEqual('SET FOREIGN_KEY_CHECKS=0');
		});

		it('can enable constraint checks', () => {
			const { sql } = new DataDefinitionBuilder()
				.enableForeignKeyChecks()
				.toDatabaseQuery();

			expect(sql).toEqual('SET FOREIGN_KEY_CHECKS=1');
		});
	});

	describe('Create Database', () => {
		it('can create a database', () => {
			const { sql } = new DataDefinitionBuilder()
				.createDatabase({
					name: 'mydb',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('CREATE DATABASE mydb');
		});
	});

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
				'CREATE TABLE "user" ("id" INT, "fname" VARCHAR(128))'
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
				'CREATE TABLE IF NOT EXISTS "user" ("fname" VARCHAR(128))'
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
				'CREATE TABLE "user" ("id" BIGINT AUTO_INCREMENT, PRIMARY KEY ("id"))'
			);
		});

		it('can create a default value', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'created_at',
							type: ColumnType.TIMESTAMP,
							default: 'now()',
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE "user" ("created_at" TIMESTAMP DEFAULT now())'
			);
		});

		it('can create a default null', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'deactivated_at',
							type: ColumnType.TIMESTAMP,
							default: null,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE "user" ("deactivated_at" TIMESTAMP DEFAULT NULL)'
			);
		});

		it('can create a default true', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'is_bool',
							type: ColumnType.BOOL,
							default: true,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE "user" ("is_bool" BOOL DEFAULT TRUE)'
			);
		});

		it('can create a default false', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'is_bool',
							type: ColumnType.BOOL,
							default: false,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE "user" ("is_bool" BOOL DEFAULT FALSE)'
			);
		});

		it('can create a not-null column', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'username',
							type: ColumnType.VARCHAR,
							length: 255,
							required: true,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE "user" ("username" VARCHAR(255) NOT NULL)'
			);
		});

		it('can create a not-null column with default function', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'user',
					columns: [
						{
							name: 'username',
							type: ColumnType.VARCHAR,
							length: 255,
							required: true,
							default: DatabaseFunctions.uuid(),
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE "user" ("username" VARCHAR(255) NOT NULL DEFAULT (uuid()))'
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

			expect(sql).toEqual(
				'CREATE TABLE "user" ("balance" DECIMAL(4, 2))'
			);
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
				'CREATE TABLE "post" ("userId" INT, ' +
					'CONSTRAINT fk_post_userId ' +
					'FOREIGN KEY ("userId") ' +
					'REFERENCES "user"("id") ' +
					'ON UPDATE CASCADE ' +
					'ON DELETE RESTRICT' +
					')'
			);
		});

		it('can create unique constraints', () => {
			const { sql } = new DataDefinitionBuilder()
				.createTable({
					name: 'post',
					columns: [
						{
							name: 'title',
							type: ColumnType.VARCHAR,
							length: 255,
							isUnique: true,
						},
					],
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE TABLE "post" ("title" VARCHAR(255), ' +
					'CONSTRAINT uq_post_title ' +
					'UNIQUE("title"))'
			);
		});
	});

	describe('Create User', () => {
		it('can create a user', () => {
			const { sql } = new DataDefinitionBuilder()
				.createUser({
					name: 'myuser',
					password: 'password1234',
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'CREATE USER myuser WITH PASSWORD \'password1234\''
			);
		});
	});

	describe('Grant', () => {
		it('can grant all', () => {
			const { sql } = new DataDefinitionBuilder()
				.grant({
					privileges: 'ALL',
					on: '*',
					to: 'testuser',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('GRANT ALL ON *.* TO testuser');
		});

		it('can grant all to a database', () => {
			const { sql } = new DataDefinitionBuilder()
				.grant({
					privileges: 'ALL',
					on: { database: 'mydb' },
					to: 'testuser',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('GRANT ALL ON mydb.* TO testuser');
		});

		it('can grant all to a database/table', () => {
			const { sql } = new DataDefinitionBuilder()
				.grant({
					privileges: 'ALL',
					on: { database: 'mydb', table: 'mytable' },
					to: 'testuser',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('GRANT ALL ON mydb.mytable TO testuser');
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
				'ALTER TABLE "user" ' +
					'ADD "fname" VARCHAR(255), "lname" VARCHAR(255)'
			);
		});

		it('can add foreign keys', () => {
			const { sql } = new DataDefinitionBuilder()
				.addForeignKey({
					table: 'post',
					columns: ['userId'],
					referencesTable: 'user',
					referencesColumns: ['id'],
					onUpdate: 'CASCADE',
					onDelete: 'RESTRICT',
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'ALTER TABLE "post" ' +
					'ADD CONSTRAINT fk_post_userId ' +
					'FOREIGN KEY ("userId") ' +
					'REFERENCES "user"("id") ' +
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
				'ALTER TABLE "user" ALTER COLUMN "email" "email" VARCHAR(1024)'
			);
		});

		it('can drop a column', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropColumn({
					table: 'user',
					column: 'email',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('ALTER TABLE "user" DROP COLUMN "email"');
		});

		it('can drop a foreign key constraint', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropForeignKey({
					table: 'user',
					fk: 'fk_post_userId',
				})
				.toDatabaseQuery();

			expect(sql).toEqual(
				'ALTER TABLE "user" DROP FOREIGN KEY fk_post_userId'
			);
		});

		it('can rename a table', () => {
			const { sql } = new DataDefinitionBuilder()
				.renameTable({
					table: 'user',
					to: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('ALTER TABLE "user" RENAME "user"');
		});
	});

	describe('Drop Database', () => {
		it('can drop a database', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropDatabase({ name: 'mytestdb' })
				.toDatabaseQuery();

			expect(sql).toEqual('DROP DATABASE mytestdb');
		});

		it('can drop a table if exists', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropDatabase({
					name: 'mytestdb',
					ifExists: true,
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP DATABASE IF EXISTS mytestdb');
		});
	});

	describe('Drop Table', () => {
		it('can drop a table', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropTable({
					tables: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP TABLE "user"');
		});

		it('can drop multiple tables', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropTable({
					tables: ['user', 'test'],
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP TABLE "user","test"');
		});

		it('can drop a table if exists', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropTable({
					tables: 'user',
					ifExists: true,
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP TABLE IF EXISTS "user"');
		});
	});

	describe('Drop User', () => {
		it('can drop a user', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropUser({
					names: 'user',
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP USER user');
		});

		it('can drop multiple users', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropUser({
					names: ['user', 'test'],
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP USER user,test');
		});

		it('can drop a user if exists', () => {
			const { sql } = new DataDefinitionBuilder()
				.dropUser({
					names: 'user',
					ifExists: true,
				})
				.toDatabaseQuery();

			expect(sql).toEqual('DROP USER IF EXISTS user');
		});
	});

	describe('Truncate', () => {
		it('can truncate a table', () => {
			const { sql } = new DataDefinitionBuilder()
				.truncate({ table: 'user' })
				.toDatabaseQuery();

			expect(sql).toEqual('TRUNCATE TABLE "user"');
		});
	});
});
