import { DatabaseRecord, DatabaseRecordId } from '../record';

/**
 * A record in the seed table
 */
export interface SeedRecord extends DatabaseRecord {
	id: DatabaseRecordId;
	name: string;
	table: string;
	recordId: string;
	timestamp: string;
}
