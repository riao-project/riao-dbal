import { SchemaTable } from "./schema-table";

export interface Schema {
	tables: Record<string, SchemaTable>;
}
