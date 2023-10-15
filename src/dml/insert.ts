import { DatabaseRecord } from '../record';

export interface InsertOptions<T extends DatabaseRecord = DatabaseRecord> {
	table?: string;
	records: Partial<T> | Partial<T>[];
	ifNotExists?: boolean;
	onDuplicateKeyUpdate?: Partial<T>;
	primaryKey?: string;
}

export interface InsertOneOptions<T extends DatabaseRecord = DatabaseRecord>
	extends InsertOptions<T> {
	records: Partial<T>;
}
