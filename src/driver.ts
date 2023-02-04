import { DatabaseConnectionOptions } from './connection-options';
import { DatabaseQueryResult } from './query';

export interface DatabaseDriver {
	connect: (options: DatabaseConnectionOptions) => Promise<void>;
	disconnect: () => Promise<void>;
	query: (QueryOptions) => Promise<DatabaseQueryResult>;
}
