import { DatabaseConnectionOptions } from './connection-options';
import { DatabaseQueryOptions, DatabaseQueryResult } from './query';
import { DatabaseQueryBuilder } from './dml/query-builder';

export interface DatabaseDriverInterface {
	connect: (options: DatabaseConnectionOptions) => Promise<this>;
	disconnect: () => Promise<void>;
	query: (
		options: DatabaseQueryOptions | DatabaseQueryBuilder
	) => Promise<DatabaseQueryResult>;
	queryBuilder: typeof DatabaseQueryBuilder;
	getQueryBuilder: () => DatabaseQueryBuilder;
	getVersion: () => Promise<string>;
}

export abstract class BaseDatabaseDriver {
	public queryBuilder: typeof DatabaseQueryBuilder;

	public getQueryBuilder(): DatabaseQueryBuilder {
		return new this.queryBuilder();
	}
}

export type DatabaseDriver = { new (): DatabaseDriverInterface };
