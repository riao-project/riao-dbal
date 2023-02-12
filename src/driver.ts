import { DatabaseConnectionOptions } from './connection-options';
import {
	DatabaseQueryOptions,
	DatabaseQueryResult,
	DatabaseQueryTypes,
} from './query';
import { DatabaseQueryBuilder } from './dml/query-builder';
import { DataDefinitionBuilder } from './ddl/ddl-builder';
import { Builder } from './builder';

export interface DatabaseDriverInterface {
	dataDefinitionBuilder: typeof DataDefinitionBuilder;
	queryBuilder: typeof DatabaseQueryBuilder;

	connect: (options: DatabaseConnectionOptions) => Promise<this>;
	disconnect: () => Promise<void>;
	query: (options: DatabaseQueryTypes) => Promise<DatabaseQueryResult>;
	getDataDefinitionBuilder: () => DataDefinitionBuilder;
	getQueryBuilder: () => DatabaseQueryBuilder;
	getVersion: () => Promise<string>;
}

export abstract class BaseDatabaseDriver {
	public dataDefinitionBuilder: typeof DataDefinitionBuilder;
	public queryBuilder: typeof DatabaseQueryBuilder;

	public getDataDefinitionBuilder(): DataDefinitionBuilder {
		return new this.dataDefinitionBuilder();
	}

	public getQueryBuilder(): DatabaseQueryBuilder {
		return new this.queryBuilder();
	}

	protected toDatabaseQueryOptions(
		from: DatabaseQueryTypes
	): DatabaseQueryOptions {
		if (from instanceof Builder) {
			return from.toDatabaseQuery();
		}

		return from;
	}
}

export type DatabaseDriver = { new (): DatabaseDriverInterface };
