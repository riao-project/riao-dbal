import { ColumnOptions } from '../column';

export interface SchemaTable {
	name: string;
	type: 'table' | 'view';
	columns: Record<string, ColumnOptions>;
	primaryKey?: string;
}
