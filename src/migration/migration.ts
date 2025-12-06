import { QueryRepository } from '../dml/query-repository';
import { DataDefinitionRepository } from '../ddl/ddl-repository';
import { Database } from '../database';

export class Migration<TOptions = Record<string, any>> {
	protected db: Database;
	protected ddl: DataDefinitionRepository;
	protected query: QueryRepository;
	protected options?: TOptions;

	public constructor(db: Database, options?: TOptions) {
		this.db = db;
		this.ddl = db.ddl;
		this.query = db.query;
		this.options = options;
	}

	public async up(): Promise<void> {}

	public async down(): Promise<void> {}
}

export type mytype = typeof Migration;
