import { DatabaseConnectionOptions } from './connection-options';
import {
	DatabaseQueryOptions,
	DatabaseQueryResult,
	DatabaseQueryTypes,
} from '../query';
import { DatabaseQueryBuilder } from '../dml/query-builder';
import { DataDefinitionBuilder } from '../ddl/ddl-builder';
import { Builder } from '../builder';
import { SchemaQueryRepository } from '../schema';

export class DatabaseDriver {
	public dataDefinitionBuilder: typeof DataDefinitionBuilder;
	public queryBuilder: typeof DatabaseQueryBuilder;
	public schemaQueryRepository: typeof SchemaQueryRepository;

	public async connect(options: DatabaseConnectionOptions): Promise<this> {
		throw new Error('DatabaseDriver missing connect method');
	}

	public async disconnect(): Promise<void> {
		throw new Error('DatabaseDriver missing disconnect method');
	}

	public async query(
		options: DatabaseQueryTypes
	): Promise<DatabaseQueryResult> {
		throw new Error('DatabaseDriver missing query method');
	}

	public getDataDefinitionBuilder(): DataDefinitionBuilder {
		return new this.dataDefinitionBuilder();
	}

	public getQueryBuilder(): DatabaseQueryBuilder {
		return new this.queryBuilder();
	}

	public async getVersion(): Promise<string> {
		throw new Error('DatabaseDriver missing getVersion method');
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
