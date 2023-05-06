import { DatabaseRecord } from '../record';
import { Join } from './join';
import { OrderBy } from './order-by';
import { Where } from './where';

export type SelectColumn<T extends DatabaseRecord = DatabaseRecord> =
	keyof Partial<T> & string;

export interface SelectQuery<T extends DatabaseRecord = DatabaseRecord> {
	columns?: SelectColumn<T>[];
	table?: string;
	join?: Join[];
	where?: Where<T> | Where<T>[];
	limit?: number;
	orderBy?: OrderBy<T>;
}
