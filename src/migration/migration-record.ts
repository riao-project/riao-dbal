import { DatabaseRecord, DatabaseRecordId } from '../record';

/**
 * A record in the migration table
 */
export interface MigrationRecord extends DatabaseRecord {
	id: DatabaseRecordId;
	name: string;
	timestamp: string;
}
