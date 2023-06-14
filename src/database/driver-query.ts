import { DataDefinitionBuilder } from '../ddl';
import { DatabaseQueryBuilder } from '../dml';

export interface DatabaseQueryOptions {
	sql: string;
	params?: any[];
}

export type DatabaseQueryTypes =
	| DatabaseQueryOptions
	| DataDefinitionBuilder
	| DatabaseQueryBuilder;

export interface DatabaseQueryResult {
	results?: Record<string, any>[];
}
