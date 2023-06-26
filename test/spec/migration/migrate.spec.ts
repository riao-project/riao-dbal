import 'jasmine';
import { TestDatabase } from '../../util/database';
import { MigrationRunner } from '../../../src/migration';
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
		const logged = [];
		const log = (...args) => logged.push(args.join(''));

		await runner.run('test/sample-migrations', log);

		expect((db.driver as TestDatabaseDriver).capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS riao_migration ' +
				'(id INT AUTO_INCREMENT, name VARCHAR(255), ' +
				'timestamp TIMESTAMP DEFAULT now(), PRIMARY KEY (id)); ' +
				'SELECT name FROM riao_migration; ' +
				'CREATE TABLE IF NOT EXISTS sample (id INT); ' +
				'INSERT INTO riao_migration (name) VALUES (?)'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([
			'123-sample-migration',
		]);

		expect(logged.join('')).toEqual(
			'Discovered 1 pending migrations in this direction.' +
				'Running 1 migrations...' +
				'UP | 123-sample-migration' +
				'Migrations complete'
		);
	});

	it('can run migrations down', async () => {
		const logged = [];
		const log = (...args) => logged.push(args.join(''));

		await runner.run('test/sample-migrations', log, 'down');

		expect((db.driver as TestDatabaseDriver).capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS riao_migration ' +
				'(id INT AUTO_INCREMENT, name VARCHAR(255), ' +
				'timestamp TIMESTAMP DEFAULT now(), PRIMARY KEY (id)); ' +
				'SELECT name FROM riao_migration'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([]);

		expect(logged.join('')).toEqual('All migrations have already run');
	});
});
