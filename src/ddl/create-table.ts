import { ColumnOptions } from '../column';
import { ForeignKeyConstraint } from './foreign-key-constraint';

export interface CreateTableOptions {
	name: string;
	columns: ColumnOptions[];
	ifNotExists?: boolean;
	foreignKeys?: ForeignKeyConstraint[];
}
