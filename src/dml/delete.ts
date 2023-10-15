import { DatabaseRecord } from '../record';
import { Join } from './join';
import { Where } from './where';

export interface DeleteOptions<T extends DatabaseRecord = DatabaseRecord> {
	table?: string;
	join?: Join[];
	where: Where<T> | Where<T>[];
}
