import { DatabaseRecordId } from '../record';

/**
 * A record in the seed table
 */
export interface SeedRecord {
	id: DatabaseRecordId;
	name: string;
	tableName: string;
	recordId: string;
	timestamp: string;
}
