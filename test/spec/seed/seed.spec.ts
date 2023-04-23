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
				'PRIMARY KEY (id))'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([]);

		expect(logged.join('')).toEqual(
			'Discovered 1 seeds.' +
				'Running 1 seeds...' +
				'UP | 123-sample-seed' +
				'Seeds complete'
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
				'PRIMARY KEY (id))'
		);

		expect((db.driver as TestDatabaseDriver).capturedParams).toEqual([]);

		expect(logged.join('')).toEqual(
			'Discovered 1 seeds.' +
				'Running 1 seeds...' +
				'DOWN | 123-sample-seed' +
				'Seeds complete'
		);
	});
});
