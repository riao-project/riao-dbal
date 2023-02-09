import { DatabaseConnectionOptions } from './connection-options';
import { DatabaseQueryResult } from './query';
import { DatabaseQueryBuilder } from './query-builder';

export interface DatabaseDriver {
	connect: (options: DatabaseConnectionOptions) => Promise<void>;
	disconnect: () => Promise<void>;
	query: (QueryOptions) => Promise<DatabaseQueryResult>;
	queryBuilder: typeof DatabaseQueryBuilder;
}
