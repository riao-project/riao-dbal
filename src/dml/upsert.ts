import { DatabaseRecord } from '../record';

export interface UpsertOptions<T extends DatabaseRecord = DatabaseRecord> {
	table?: string;
	set: Partial<T>;
	uniqueKeys?: string[];
}
