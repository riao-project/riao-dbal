import { ColumnOptions } from 'src/column-options';
import { ForeignKeyConstraint } from './foreign-key-constraint';

export interface AddColumnsOptions {
	table: string;
	columns: ColumnOptions[];
}

export interface AddForeignKeyOptions {
	table: string;
	fk: ForeignKeyConstraint;
}

export interface ChangeColumnOptions {
	table: string;
	column: string;
	options: ColumnOptions;
}
