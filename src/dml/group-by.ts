import { DatabaseRecord } from '../record';

type AllowedKeys<T extends DatabaseRecord = DatabaseRecord> = keyof T & string;

export type GroupBy<T extends DatabaseRecord = DatabaseRecord> =
	AllowedKeys<T>[];
