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

export interface DropColumnOptions {
	table: string;
	column: string;
}

export interface DropForeignKeyOptions {
	table: string;
	fk: string;
}

export interface RenameColumnOptions {
	table: string;
	from: string;
	to: string;
}

export interface RenameTableOptions {
	table: string;
	to: string;
}
