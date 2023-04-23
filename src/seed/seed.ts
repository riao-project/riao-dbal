import { QueryRepository } from '../repository/query-repository';
import { DataDefinitionRepository } from '../repository/ddl-repository';
import { Database } from '../database';

export class Seed {
	protected db: Database;
	protected ddl: DataDefinitionRepository;
	protected query: QueryRepository;
	protected name: string;

	public constructor(db: Database) {
		this.db = db;
		this.ddl = db.ddl;
		this.query = db.query as QueryRepository;
		this.name = this.constructor.name;
	}

	public async up(): Promise<void> {}

	public async down(): Promise<void> {}
}
