import 'jasmine';
import { TestDatabase } from '../../util/database';
import { MigrationRunner } from '../../../src/migration';
import { TestDatabaseDriver } from '../../../test/util/driver';

describe('Migrate', () => {
	it('can run migrations', async () => {
		const db = new TestDatabase();
		await db.init();

		const runner = new MigrationRunner(db);

		const logged = [];
		const log = (...args) => logged.push(args.join(''));

		await runner.run('test/sample-migrations', log);

		expect((db.driver as TestDatabaseDriver).capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS riao_migration ' +
				'(id INT AUTO_INCREMENT, name VARCHAR(255), ' +
				'timestamp DATETIME DEFAULT now(), PRIMARY KEY (id)); ' +
				'SELECT name FROM riao_migration; ' +
				'CREATE TABLE IF NOT EXISTS sample (id INT); ' +
				'INSERT INTO riao_migration (`name`) VALUES (?)'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([
			'123-sample-migration',
		]);

		expect(logged.join('')).toEqual(
			'Running 1 migrations...' +
				'UP | 123-sample-migration' +
				'Migrations complete'
		);
	});
});
