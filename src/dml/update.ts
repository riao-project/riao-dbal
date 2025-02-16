import { Expression } from '../expression';
import { DatabaseRecord } from '../record';
import { From } from './from';
import { Join } from './join';

export interface UpdateOptions<T extends DatabaseRecord = DatabaseRecord> {
	table?: string;
	from?: From;
	join?: Join[];
	set: Partial<T>;
	where?: Expression<T>;
}
