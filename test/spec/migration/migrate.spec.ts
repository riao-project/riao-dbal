import 'jasmine';
import { MigrationRunner } from '../../../src/migration';
import { TestDatabaseDriver } from '../../../test/util/driver';

describe('Migrate', () => {
	it('can run migrations', async () => {
		const driver = new TestDatabaseDriver();
		const runner = new MigrationRunner(driver);

		const logged = [];
		const log = (...args) => logged.push(args.join(''));

		await runner.run('test/sample-migrations', log);

		expect(driver.capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS migrations ' +
				'(id INT AUTO_INCREMENT, name VARCHAR(255), ' +
				'timestamp DATETIME DEFAULT now(), PRIMARY KEY (id)); ' +
				'SELECT name FROM migrations; ' +
				'CREATE TABLE IF NOT EXISTS sample (id INT); ' +
				'INSERT INTO migrations (`name`) VALUES (?)'
		);
		expect(driver.capturedParams).toEqual(['123-sample-migration']);
		expect(logged.join('')).toEqual(
			'Running 1 migrations...' +
				'UP | 123-sample-migration' +
				'Migrations complete'
		);
	});
});
