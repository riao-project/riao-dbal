import { DatabaseRecord } from '../record';
import { Join } from './join';
import { OrderBy } from './order-by';
import { Where } from './where';

export type SelectColumnString<T extends DatabaseRecord = DatabaseRecord> =
	keyof Partial<T> & string;

export interface SelectColumnAs<T extends DatabaseRecord = DatabaseRecord> {
	column: SelectColumnString;
	as?: string;
}

export type SelectColumn<T extends DatabaseRecord = DatabaseRecord> =
	| SelectColumnString<T>
	| SelectColumnAs<T>;

export interface SelectQuery<T extends DatabaseRecord = DatabaseRecord> {
	columns?: SelectColumn<T>[];
	table?: string;
	join?: Join[];
	where?: Where<T> | Where<T>[];
	limit?: number;
	orderBy?: OrderBy<T>;
}
