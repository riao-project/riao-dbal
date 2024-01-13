import { DatabaseRecord } from '../record';

export interface BaseInsertOptions<T extends DatabaseRecord = DatabaseRecord> {
	table?: string;
	ifNotExists?: boolean;
	onDuplicateKeyUpdate?: Partial<T>;
	primaryKey?: string;
}

export interface InsertOptions<T extends DatabaseRecord = DatabaseRecord>
	extends BaseInsertOptions<T> {
	records: Partial<T> | Partial<T>[];
}

export interface InsertOneOptions<T extends DatabaseRecord = DatabaseRecord>
	extends BaseInsertOptions<T> {
	record: Partial<T>;
	ignoreReturnId?: boolean;
}
