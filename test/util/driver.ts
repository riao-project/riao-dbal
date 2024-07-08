import {
	DatabaseDriver,
	DatabaseQueryBuilder,
	DatabaseQueryResult,
	DatabaseQueryTypes,
	DataDefinitionBuilder,
	SchemaQueryRepository,
	Transaction,
} from '../../src';

/**
 * Dummy db driver for testing. Dry-runs queries and captures
 * 	sql & params for assertion.
 */
export class TestDatabaseDriver extends DatabaseDriver {
	public capturedSql = '';
	public capturedParams: any[] = [];
	public returnValue: any[] = [];

	public dataDefinitionBuilder = DataDefinitionBuilder;
	public queryBuilder = DatabaseQueryBuilder;
	public schemaQueryRepository = SchemaQueryRepository;

	public override async connect() {
		return this;
	}

	public override async disconnect() {}

	public override async query(
		options: DatabaseQueryTypes
	): Promise<DatabaseQueryResult> {
		const q = this.toDatabaseQueryOptions(options);

		if (this.capturedSql) {
			this.capturedSql += '; ';
		}

		this.capturedSql += q.sql;
		this.capturedParams = this.capturedParams.concat(q.params);

		return { results: this.returnValue };
	}

	public async resetTestCapture() {
		this.capturedSql = '';
		this.capturedParams = [];
	}

	public override async transaction<T>(
		fn: (transaction: Transaction) => Promise<T>,
		transaction: Transaction
	): Promise<T> {
		return await fn(transaction);
	}
}
