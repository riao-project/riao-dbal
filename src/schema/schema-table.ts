import { ColumnOptions } from '../column';

export interface SchemaTable {
	name: string;
	type: 'table' | 'view';
}

export interface SchemaTableWithColumns extends SchemaTable {
	columns: Record<string, ColumnOptions>;
	primaryKey?: string;
}
