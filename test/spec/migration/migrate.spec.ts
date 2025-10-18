import 'jasmine';
import { TestDatabase } from '../../util/database';
import { Migration, MigrationRunner } from '../../../src/migration';
import { TestDatabaseDriver } from '../../../test/util/driver';

describe('Migrate', () => {
	let db: TestDatabase;
	let runner: MigrationRunner;

	beforeAll(async () => {
		db = new TestDatabase();
		await db.init();

		runner = new MigrationRunner(db);
	});

	beforeEach(async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();
	});

	it('can run migrations', async () => {
		const logged: string[] = [];
		const log = (...args: any[]) => logged.push(args.join(''));

		await runner.run('test/sample-migrations', log);

		expect((db.driver as TestDatabaseDriver).capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS "riao_migration" ' +
				'("id" INT AUTO_INCREMENT, "name" VARCHAR(255), ' +
				'"timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
				'PRIMARY KEY ("id")); ' +
				'SELECT "name" FROM "riao_migration"; ' +
				'CREATE TABLE IF NOT EXISTS "sample" ("id" INT); ' +
				'INSERT INTO "riao_migration" ("name") VALUES (?); ' +
				'SELECT "TABLE_NAME", "TABLE_TYPE" ' +
				'FROM "information_schema"."tables" ' +
				'WHERE ("TABLE_SCHEMA" = ?)'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([
			'123-sample-migration',
			undefined, // TODO: Why does build schema add this?
		]);

		expect(logged.join('')).toEqual(
			'Discovered 1 pending migrations in this direction.' +
				'Running 1 migrations...' +
				'UP | 123-sample-migration' +
				'Rebuilding Schema...' +
				'Migrations Complete!'
		);
	});

	it('can run migrations down', async () => {
		const logged: string[] = [];
		const log = (...args: any[]) => logged.push(args.join(''));

		await runner.run('test/sample-migrations', log, 'down');

		expect((db.driver as TestDatabaseDriver).capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS "riao_migration" ' +
				'("id" INT AUTO_INCREMENT, "name" VARCHAR(255), ' +
				'"timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
				'PRIMARY KEY ("id")); ' +
				'SELECT "name" FROM "riao_migration"'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([]);

		expect(logged.join('')).toEqual('All migrations have already run');
	});

	it('can run migrations programmatically', async () => {
		const logged: string[] = [];
		const log = (...args: any[]) => logged.push(args.join(''));

		const migrations = {
			'001-test-migration': new (class extends Migration {
				async up() {
					await this.ddl.createTable({
						name: 'test_table',
						columns: [],
					});
				}

				async down() {}
			})(db),
		};

		await runner.run(migrations, log);

		expect((db.driver as TestDatabaseDriver).capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS "riao_migration" ' +
				'("id" INT AUTO_INCREMENT, "name" VARCHAR(255), ' +
				'"timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
				'PRIMARY KEY ("id")); ' +
				'SELECT "name" FROM "riao_migration"; ' +
				'CREATE TABLE "test_table"); ' +
				'INSERT INTO "riao_migration" ("name") VALUES (?); ' +
				'SELECT "TABLE_NAME", "TABLE_TYPE" ' +
				'FROM "information_schema"."tables" ' +
				'WHERE ("TABLE_SCHEMA" = ?)'
		);
	});
});
