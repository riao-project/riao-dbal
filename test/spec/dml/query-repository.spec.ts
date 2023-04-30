import 'jasmine';
import { QueryRepository } from '../../../src/dml';
import { TestDatabaseDriver } from '../../util/driver';

describe('Query Repository', () => {
	it('can find records', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new QueryRepository(driver);

		await repo.find({
			table: 'user',
			columns: ['fname'],
			where: { id: 1 },
			limit: 10,
			orderBy: {
				id: 'ASC',
			},
		});

		expect(driver.capturedSql).toEqual(
			'SELECT fname FROM user WHERE (id = ?) LIMIT 10 ORDER BY id ASC'
		);

		expect(driver.capturedParams).toEqual([1]);
	});

	it('can find one record', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new QueryRepository(driver);

		await repo.findOne({
			table: 'user',
			columns: ['fname'],
			where: { id: 2 },
		});

		expect(driver.capturedSql).toEqual(
			'SELECT fname FROM user WHERE (id = ?) LIMIT 1'
		);

		expect(driver.capturedParams).toEqual([2]);
	});

	it('can insert a record', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new QueryRepository(driver);

		await repo.insert({
			table: 'user',
			records: [{ id: 1 }],
		});

		expect(driver.capturedSql).toEqual('INSERT INTO user (id) VALUES (?)');

		expect(driver.capturedParams).toEqual([1]);
	});

	it('can update a record', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new QueryRepository(driver);

		await repo.update({
			table: 'user',
			set: { fname: 'test' },
			where: { id: 5 },
		});

		expect(driver.capturedSql).toEqual(
			'UPDATE user SET fname = ? WHERE (id = ?)'
		);

		expect(driver.capturedParams).toEqual(['test', 5]);
	});

	it('can delete a record', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new QueryRepository(driver);

		await repo.delete({
			table: 'user',
			where: { id: 5 },
		});

		expect(driver.capturedSql).toEqual('DELETE FROM user WHERE (id = ?)');

		expect(driver.capturedParams).toEqual([5]);
	});
});
