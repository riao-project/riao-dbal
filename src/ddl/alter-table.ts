import { ColumnOptions } from '../column';
import { ForeignKeyConstraint } from './foreign-key-constraint';

export interface BaseAlterTableOptions {
	table: string;
}

export interface AddColumnsOptions extends BaseAlterTableOptions {
	columns: ColumnOptions[];
}

export interface AddForeignKeyOptions extends BaseAlterTableOptions {
	fk: ForeignKeyConstraint;
}

export interface ChangeColumnOptions extends BaseAlterTableOptions {
	column: string;
	options: ColumnOptions;
}

export interface DropColumnOptions extends BaseAlterTableOptions {
	column: string;
}

export interface DropForeignKeyOptions extends BaseAlterTableOptions {
	fk: string;
}

export interface RenameColumnOptions extends BaseAlterTableOptions {
	from: string;
	to: string;
}

export interface RenameTableOptions extends BaseAlterTableOptions {
	to: string;
}
