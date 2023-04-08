import 'jasmine';
import { TestDatabase } from '../../util/database';
import { SeedRunner } from '../../../src/seed';
import { TestDatabaseDriver } from '../../util/driver';

describe('Seed', () => {
	it('can run seeds', async () => {
		const db = new TestDatabase();
		await db.init();

		const runner = new SeedRunner(db);

		const logged = [];
		const log = (...args) => logged.push(args.join(''));

		await runner.run('test/sample-seeds', log);

		expect((db.driver as TestDatabaseDriver).capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS riao_seed (' +
				'id INT AUTO_INCREMENT, name VARCHAR(255), ' +
				'tableName VARCHAR(255), recordId VARCHAR(255), ' +
				'timestamp DATETIME DEFAULT now(), ' +
				'PRIMARY KEY (id)); ' +
				'INSERT INTO sample (fname, lname) ' +
				'VALUES (?, ?), (?, ?) ON DUPLICATE KEY UPDATE id = id; ' +
				'INSERT INTO riao_seed VALUE ON DUPLICATE KEY UPDATE id = id'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([
			'Bob',
			'West',
			'Tom',
			'Test',
		]);

		expect(logged.join('')).toEqual(
			'Running 1 seeds...' + 'UP | 123-sample-seed' + 'Seeds complete'
		);
	});

	it('can run seeds down', async () => {
		const db = new TestDatabase();
		await db.init();

		const runner = new SeedRunner(db);

		const logged = [];
		const log = (...args) => logged.push(args.join(''));

		await runner.run('test/sample-seeds', log, 'down');

		expect((db.driver as TestDatabaseDriver).capturedSql).toEqual(
			'CREATE TABLE IF NOT EXISTS riao_seed (' +
				'id INT AUTO_INCREMENT, name VARCHAR(255), ' +
				'tableName VARCHAR(255), recordId VARCHAR(255), ' +
				'timestamp DATETIME DEFAULT now(), ' +
				'PRIMARY KEY (id)); ' +
				'SELECT * FROM riao_seed WHERE (name = ?); ' +
				'DELETE FROM sample WHERE (id IN)); ' +
				'DELETE FROM riao_seed WHERE (name = ?)'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([
			'SampleSeed',
			'SampleSeed',
		]);

		expect(logged.join('')).toEqual(
			'Running 1 seeds...' + 'DOWN | 123-sample-seed' + 'Seeds complete'
		);
	});
});
