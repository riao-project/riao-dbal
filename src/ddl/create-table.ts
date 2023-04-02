import { ColumnOptions } from '../column-options';
import { ForeignKeyConstraint } from './foreign-key-constraint';

export interface CreateTableOptions {
	name: string;
	columns: ColumnOptions[];
	ifNotExists?: boolean;
	foreignKeys?: ForeignKeyConstraint[];
}
