import { QueryRepository } from '../dml/query-repository';
import { DataDefinitionRepository } from '../ddl/ddl-repository';
import { Database } from '../database';

export class Migration {
	protected db: Database;
	protected ddl: DataDefinitionRepository;
	protected query: QueryRepository;

	public constructor(db: Database) {
		this.db = db;
		this.ddl = db.ddl;
		this.query = db.query;
	}

	public async up(): Promise<void> {}

	public async down(): Promise<void> {}
}
