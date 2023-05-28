import { SchemaTableWithColumns } from './schema-table';

export interface Schema {
	tables: Record<string, SchemaTableWithColumns>;
}
