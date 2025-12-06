import 'jasmine';
import { TestDatabase } from '../../util/database';
import { Migration, MigrationRunner } from '../../../src/migration';
import { TestDatabaseDriver } from '../../../test/util/driver';

function getRiaoMigrationSql() {
	return (
		'CREATE TABLE IF NOT EXISTS "riao_migration" ' +
		'("id" INT AUTO_INCREMENT, "name" VARCHAR(255), ' +
		'"timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ' +
		'PRIMARY KEY ("id")); ' +
		'SELECT "COLUMN_NAME" FROM "information_schema"."columns" ' +
		'WHERE ("TABLE_SCHEMA" = ? AND "TABLE_NAME" = ? AND ' +
		'"COLUMN_KEY" = ?) LIMIT 1; SELECT "COLUMN_NAME", ' +
		'"DATA_TYPE" FROM "information_schema"."columns" ' +
		'WHERE ("TABLE_SCHEMA" = ? AND "TABLE_NAME" = ?) ' +
		'ORDER BY "ORDINAL_POSITION" ASC; ' +
		'ALTER TABLE "riao_migration" ADD "package" ' +
		'VARCHAR(255) DEFAULT NULL; ' +
		'SELECT "name" FROM "riao_migration" WHERE ("package" IS NULL)'
	);
}

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
			getRiaoMigrationSql() +
				'; ' +
				'CREATE TABLE IF NOT EXISTS "sample" ("id" INT); ' +
				'INSERT INTO "riao_migration" ("name", "package") ' +
				'VALUES (?, ?); SELECT "TABLE_NAME", "TABLE_TYPE" ' +
				'FROM "information_schema"."tables" ' +
				'WHERE ("TABLE_SCHEMA" = ?)'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([
			undefined, // TODO: Why does build schema add this?
			'riao_migration',
			'PRI',
			undefined,
			'riao_migration',
			'123-sample-migration',
			null,
			undefined,
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
			getRiaoMigrationSql()
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([
			undefined,
			'riao_migration',
			'PRI',
			undefined,
			'riao_migration',
		]);

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
			getRiaoMigrationSql() +
				'; ' +
				'CREATE TABLE "test_table"); ' +
				'INSERT INTO "riao_migration" ("name", "package") ' +
				'VALUES (?, ?); ' +
				'SELECT "TABLE_NAME", "TABLE_TYPE" ' +
				'FROM "information_schema"."tables" ' +
				'WHERE ("TABLE_SCHEMA" = ?)'
		);
	});
});
