import { Expression } from '../expression';
import { DatabaseRecord } from '../record';
import { Join } from './join';

export interface DeleteOptions<T extends DatabaseRecord = DatabaseRecord> {
	table?: string;
	join?: Join[];
	where: Expression<T>;
}
