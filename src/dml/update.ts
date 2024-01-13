import { Expression } from '../expression';
import { DatabaseRecord } from '../record';
import { Join } from './join';

export interface UpdateOptions<T extends DatabaseRecord = DatabaseRecord> {
	table?: string;
	join?: Join[];
	set: Partial<T>;
	where?: Expression<T>;
}
