import { DatabaseRecord } from '../record';

export type OrderBy<T extends DatabaseRecord = DatabaseRecord> = Partial<
	Record<keyof T, 'ASC' | 'DESC'>
>;
