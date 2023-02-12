import { ColumnOptions } from './column-options';

export interface CreateTableOptions {
	name: string;
	columns: ColumnOptions[];
	ifNotExists?: boolean;
}
