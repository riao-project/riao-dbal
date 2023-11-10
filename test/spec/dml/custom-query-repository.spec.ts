import 'jasmine';
import { User } from '../../sample-models/user';
import { TestDatabase } from '../../util/database';
import { QueryRepository } from '../../../src/';
import { TestDatabaseDriver } from '../../util/driver';

const fileScopeDb = new TestDatabase();
const fileScopeRepo = fileScopeDb.getQueryRepository<User>({ table: 'user' });

async function mockDb(): Promise<{
	userRepo: QueryRepository<User>;
	driver: TestDatabaseDriver;
}> {
	const db = new TestDatabase();
	await db.init();

	return {
		userRepo: db.getQueryRepository<User>({ table: 'user' }),
		driver: db.driver,
	};
}

describe('Custom Query Repository', () => {
	it('can be re-constructed', async () => {
		await fileScopeDb.init();

		await fileScopeRepo.delete({ where: { id: 5 } });

		expect(fileScopeDb.driver.capturedSql).toEqual(
			'DELETE FROM "user" WHERE ("id" = ?)'
		);

		expect(fileScopeDb.driver.capturedParams).toEqual([5]);
	});

	it('can get the table name', async () => {
		const { driver, userRepo } = await mockDb();

		const table = await userRepo.getTableName();
		expect(table).toEqual('user');
	});

	it('can find records', async () => {
		const { driver, userRepo } = await mockDb();

		await userRepo.find({
			columns: ['fname'],
			where: { id: 1 },
			limit: 10,
			orderBy: {
				id: 'ASC',
			},
		});

		expect(driver.capturedSql).toEqual(
			'SELECT "fname" FROM "user" WHERE ("id" = ?) ORDER BY "id" ASC LIMIT 10'
		);

		expect(driver.capturedParams).toEqual([1]);
	});

	it('can find one record', async () => {
		const { driver, userRepo } = await mockDb();

		await userRepo.findOne({
			columns: ['fname'],
			where: { id: 2 },
		});

		expect(driver.capturedSql).toEqual(
			'SELECT "fname" FROM "user" WHERE ("id" = ?) LIMIT 1'
		);

		expect(driver.capturedParams).toEqual([2]);
	});

	it('can insert a record', async () => {
		const { driver, userRepo } = await mockDb();

		await userRepo.insert({
			records: [{ id: 1 }],
		});

		expect(driver.capturedSql).toEqual(
			'INSERT INTO "user" ("id") VALUES (?)'
		);

		expect(driver.capturedParams).toEqual([1]);
	});

	it('can update a record', async () => {
		const { driver, userRepo } = await mockDb();

		await userRepo.update({
			set: { fname: 'test' },
			where: { id: 5 },
		});

		expect(driver.capturedSql).toEqual(
			'UPDATE "user" SET "fname" = ? WHERE ("id" = ?)'
		);

		expect(driver.capturedParams).toEqual(['test', 5]);
	});

	it('can delete a record', async () => {
		const { driver, userRepo } = await mockDb();

		await userRepo.delete({ where: { id: 5 } });

		expect(driver.capturedSql).toEqual(
			'DELETE FROM "user" WHERE ("id" = ?)'
		);

		expect(driver.capturedParams).toEqual([5]);
	});
});
