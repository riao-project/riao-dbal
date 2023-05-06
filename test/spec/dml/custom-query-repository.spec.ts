import 'jasmine';
import { QueryRepository } from '../../../src/dml';
import { TestDatabaseDriver } from '../../util/driver';
import { User } from '../../sample-models/user';

describe('Custom Query Repository', () => {
	it('can find records', async () => {
		const driver = new TestDatabaseDriver();
		const repo = new QueryRepository<User>({ driver, table: 'user' });

		await repo.find({
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
		const userRepo = new QueryRepository<User>({ driver, table: 'user' });

		await userRepo.findOne({
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
		const userRepo = new QueryRepository<User>({ driver, table: 'user' });

		await userRepo.insert({
			records: [{ id: 1 }],
		});

		expect(driver.capturedSql).toEqual('INSERT INTO user (id) VALUES (?)');

		expect(driver.capturedParams).toEqual([1]);
	});

	it('can update a record', async () => {
		const driver = new TestDatabaseDriver();
		const userRepo = new QueryRepository<User>({ driver, table: 'user' });

		await userRepo.update({
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
		const userRepo = new QueryRepository<User>({ driver, table: 'user' });

		await userRepo.delete({ where: { id: 5 } });

		expect(driver.capturedSql).toEqual('DELETE FROM user WHERE (id = ?)');

		expect(driver.capturedParams).toEqual([5]);
	});
});
