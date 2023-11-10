import { DatabaseRecord } from '../record';
import { SeedRecord } from './seed-record';
import { inArray } from '../conditions';
import { Seed } from './seed';

export class AutoSeed extends Seed {
	protected table?: string;
	protected records: Array<DatabaseRecord | (() => Promise<DatabaseRecord>)>;

	public async up(): Promise<void> {
		const resolvedRecords = await Promise.all(
			this.records.map(async (record) =>
				typeof record === 'function' ? record.bind(this)() : record
			)
		);

		for (const record of resolvedRecords) {
			const inserted = await this.query.insertOne({
				table: this.table,
				records: record,
				ifNotExists: true,
			});

			await this.query.insertOne({
				table: 'riao_seed',
				records: {
					name: this.name,
					tableName: this.table,
					recordId: inserted.id,
				},
				ifNotExists: true,
			});
		}
	}

	public async down(): Promise<void> {
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
