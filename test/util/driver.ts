import {
	DatabaseDriver,
	DatabaseQueryBuilder,
	DatabaseQueryResult,
	DatabaseQueryTypes,
	DataDefinitionBuilder,
	SchemaQueryRepository,
} from '../../src';

/**
 * Dummy db driver for testing. Dry-runs queries and captures
 * 	sql & params for assertion.
 */
export class TestDatabaseDriver extends DatabaseDriver {
	public capturedSql = '';
	public capturedParams: any[] = [];

	public dataDefinitionBuilder = DataDefinitionBuilder;
	public queryBuilder = DatabaseQueryBuilder;
	public schemaQueryRepository = SchemaQueryRepository;

	public async connect() {
		return this;
	}

	public async disconnect() {}

	public async query(
		options: DatabaseQueryTypes
	): Promise<DatabaseQueryResult> {
		const q = this.toDatabaseQueryOptions(options);

		if (this.capturedSql) {
			this.capturedSql += '; ';
		}

		this.capturedSql += q.sql;
		this.capturedParams = this.capturedParams.concat(q.params);

		return { results: [] };
	}

	public async resetTestCapture() {
		this.capturedSql = '';
		this.capturedParams = [];
	}
}
