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
			'SELECT "fname" FROM "user" WHERE ("id" = ?) ORDER BY "id" ASC LIMIT 10'
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

	it('can find records with from object', async () => {
		const { repo, driver } = await mockDb();

		await (repo as QueryRepository<any>).find({
			table: { u: 'user' },
			columns: ['fname'],
			where: { 'u.id': 1 },
			limit: 10,
			orderBy: { 'u.id': 'ASC' },
		});

		expect(driver.capturedSql).toEqual(
			'SELECT "fname" FROM "user" "u" WHERE ("u"."id" = ?) ORDER BY "u"."id" ASC LIMIT 10'
		);

		expect(driver.capturedParams).toEqual([1]);
	});

	it('can count records', async () => {
		const { repo, driver } = await mockDb();

		driver.returnValue = [{ count: 5 }];

		await repo.count({ table: 'user' });

		expect(driver.capturedSql).toEqual(
			'SELECT COUNT(*) AS "count" FROM "user" LIMIT 1'
		);

		expect(driver.capturedParams).toEqual([]);
	});

	it('can count distinct', async () => {
		const { repo, driver } = await mockDb();

		driver.returnValue = [{ count: 5 }];

		await repo.count({ table: 'user' }, { distinct: true });

		expect(driver.capturedSql).toEqual(
			'SELECT COUNT(DISTINCT *) AS "count" FROM "user" LIMIT 1'
		);

		expect(driver.capturedParams).toEqual([]);
	});

	it('can count column', async () => {
		const { repo, driver } = await mockDb();

		driver.returnValue = [{ count: 5 }];

		await repo.count({ table: 'user' }, { column: 'id' });

		expect(driver.capturedSql).toEqual(
			'SELECT COUNT("id") AS "count" FROM "user" LIMIT 1'
		);

		expect(driver.capturedParams).toEqual([]);
	});

	it('can count distinct column', async () => {
		const { repo, driver } = await mockDb();

		driver.returnValue = [{ count: 5 }];

		await repo.count({ table: 'user' }, { distinct: true, column: 'id' });

		expect(driver.capturedSql).toEqual(
			'SELECT COUNT(DISTINCT "id") AS "count" FROM "user" LIMIT 1'
		);

		expect(driver.capturedParams).toEqual([]);
	});

	it('can insert one record', async () => {
		const { repo, driver } = await mockDb();

		await repo.insertOne({
			ignoreReturnId: true,
			table: 'user',
			record: { id: 1 },
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

	it('can update a record with from', async () => {
		const { repo, driver } = await mockDb();

		await repo.update({
			table: 'user',
			set: { fname: 'test' },
			where: <any>{ 'other.id': 5 },
			from: 'other',
		});

		expect(driver.capturedSql).toEqual(
			'UPDATE "user" SET "fname" = ? FROM "other" WHERE ("other"."id" = ?)'
		);

		expect(driver.capturedParams).toEqual(['test', 5]);
	});

	it('can set a variable', async () => {
		const { repo, driver } = await mockDb();

		await repo.set({
			column: 'search_path',
			value: 'public',
		});

		expect(driver.capturedSql).toEqual('SET "search_path" = ?');
		expect(driver.capturedParams).toEqual(['public']);
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
