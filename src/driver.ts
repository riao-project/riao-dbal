import { DatabaseConnectionOptions } from './connection-options';
import { DatabaseQueryOptions, DatabaseQueryResult } from './query';
import { DatabaseQueryBuilder } from './dml/query-builder';

export interface DatabaseDriver {
	connect: (options: DatabaseConnectionOptions) => Promise<this>;
	disconnect: () => Promise<void>;
	query: (
		options: DatabaseQueryOptions | DatabaseQueryBuilder
	) => Promise<DatabaseQueryResult>;
	queryBuilder: typeof DatabaseQueryBuilder;
	getQueryBuilder: () => DatabaseQueryBuilder;
}
