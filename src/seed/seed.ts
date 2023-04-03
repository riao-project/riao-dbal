import { QueryRepository } from '../repository/query-repository';
import { DataDefinitionRepository } from '../repository/ddl-repository';
import { Database } from '../database';
import { DatabaseRecord } from '../record';
import { SeedRecord } from './seed-record';
import { inArray } from '../dml';

export class Seed {
	protected db: Database;
	protected ddl: DataDefinitionRepository;
	protected query: QueryRepository<SeedRecord>;
	protected table?: string;
	protected records: Array<DatabaseRecord | (() => Promise<DatabaseRecord>)>;
	protected name: string;

	public constructor(db: Database) {
		this.db = db;
		this.ddl = db.ddl;
		this.query = db.query as QueryRepository<SeedRecord>;
		this.name = this.constructor.name;
	}

	public async up(): Promise<void> {
		const resolvedRecords = await Promise.all(
			this.records.map(async (record) =>
				typeof record === 'function' ? record.bind(this)() : record
			)
		);

		const records = await this.query.insert({
			table: this.table,
			records: resolvedRecords,
			ifNotExists: true,
		});

		await this.query.insert({
			table: 'riao_seed',
			records: <Partial<SeedRecord[]>>records.map((record) => {
				return {
					name: this.name,
					tableName: this.table,
					recordId: record.id,
				};
			}),
			ifNotExists: true,
		});
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
