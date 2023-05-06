import { DatabaseRecord } from '../record';
import { Join } from './join';
import { Where } from './where';

export interface UpdateOptions<T extends DatabaseRecord = DatabaseRecord> {
	table: string;
	join?: Join[];
	set: Partial<T>;
	where?: Where<T> | Where<T>[];
}
