import 'jasmine';
import { User } from '../../sample-models/user';
import { QueryRepository } from '../../../src';
import { TestDatabase } from '../../util/database';
import { TestDatabaseDriver } from '../../util/driver';

async function mockDb(): Promise<{
	repo: QueryRepository<User>;
	driver: TestDatabaseDriver;
}> {
	const db = new TestDatabase();
	await db.init();

	return { repo: db.getQueryRepository<User>(), driver: db.driver };
}

describe('Query Repository', () => {
	it('can find records', async () => {
		const { repo, driver } = await mockDb();

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
			'SELECT "fname" FROM "user" WHERE ("id" = ?) LIMIT 10 ORDER BY "id" ASC'
		);

		expect(driver.capturedParams).toEqual([1]);
	});

	it('can find distinct records', async () => {
		const { repo, driver } = await mockDb();

		await repo.find({
			table: 'user',
			distinct: true,
		});

		expect(driver.capturedSql).toEqual('SELECT DISTINCT * FROM "user"');
		expect(driver.capturedParams).toEqual([]);
	});

	it('can find one record', async () => {
		const { repo, driver } = await mockDb();

		await repo.findOne({
			table: 'user',
			columns: ['fname'],
			where: { id: 2 },
		});

		expect(driver.capturedSql).toEqual(
			'SELECT "fname" FROM "user" WHERE ("id" = ?) LIMIT 1'
		);

		expect(driver.capturedParams).toEqual([2]);
	});

	it('can insert one record', async () => {
		const { repo, driver } = await mockDb();

		await repo.insertOne({
			table: 'user',
			records: { id: 1 },
		});

		expect(driver.capturedSql).toEqual(
			'INSERT INTO "user" ("id") VALUES (?)'
		);

		expect(driver.capturedParams).toEqual([1]);
	});

	it('can insert records', async () => {
		const { repo, driver } = await mockDb();

		await repo.insert({
			table: 'user',
			records: [{ id: 1 }, { id: 2 }],
		});

		expect(driver.capturedSql).toEqual(
			'INSERT INTO "user" ("id") VALUES (?), (?)'
		);

		expect(driver.capturedParams).toEqual([1, 2]);
	});

	it('can insert records with different shapes', async () => {
		const { repo, driver } = await mockDb();

		await repo.insert({
			table: 'user',
			records: [
				{ id: 1 },
				{ id: 2, fname: 'Tom' },
				{ fname: 'Bill', id: 3 },
			],
		});

		expect(driver.capturedSql).toEqual(
			'INSERT INTO "user" ("id", "fname") VALUES (?, ?), (?, ?), (?, ?)'
		);

		expect(driver.capturedParams).toEqual([1, null, 2, 'Tom', 3, 'Bill']);
	});

	it('can insert records with null values', async () => {
		const { repo, driver } = await mockDb();

		await repo.insert({
			table: 'user',
			records: [{ fname: null }],
		});

		expect(driver.capturedSql).toEqual(
			'INSERT INTO "user" ("fname") VALUES (?)'
		);

		expect(driver.capturedParams).toEqual([null]);
	});

	it('can update a record', async () => {
		const { repo, driver } = await mockDb();

		await repo.update({
			table: 'user',
			set: { fname: 'test' },
			where: { id: 5 },
		});

		expect(driver.capturedSql).toEqual(
			'UPDATE "user" SET "fname" = ? WHERE ("id" = ?)'
		);

		expect(driver.capturedParams).toEqual(['test', 5]);
	});

	it('can delete a record', async () => {
		const { repo, driver } = await mockDb();

		await repo.delete({
			table: 'user',
			where: { id: 5 },
		});

		expect(driver.capturedSql).toEqual(
			'DELETE FROM "user" WHERE ("id" = ?)'
		);

		expect(driver.capturedParams).toEqual([5]);
	});
});
