import { DatabaseRecord } from '../record';
import { SeedRecord } from './seed-record';
import { inArray } from '../comparison';
import { Seed } from './seed';

export class AutoSeed extends Seed {
	protected table?: string;
	protected records: Array<DatabaseRecord | (() => Promise<DatabaseRecord>)>;
	protected primaryKey = 'id';

	public override async up(): Promise<void> {
		const resolvedRecords = await Promise.all(
			this.records.map(async (record) =>
				typeof record === 'function' ? record.bind(this)() : record
			)
		);

		for (const record of resolvedRecords) {
			const inserted = await this.query.insertOne({
				table: this.table,
				record: record,
				ifNotExists: true,
			});

			await this.query.insertOne({
				table: 'riao_seed',
				record: {
					name: this.name,
					tableName: this.table,
					recordId: inserted[this.primaryKey],
				},
				ifNotExists: true,
			});
		}
	}

	public override async down(): Promise<void> {
		const records = (await this.query.find({
			table: 'riao_seed',
			where: { name: this.name },
		})) as SeedRecord[];

		const recordIds = records.map((record) => record.id);

		await this.query.delete({
			table: this.table,
			where: { id: inArray(recordIds) },
		});

		await this.query.delete({
			table: 'riao_seed',
			where: {
				name: this.name,
			},
		});
	}
}
