import { DatabaseRecordId } from '../record';

/**
 * A record in the migration table
 */
export interface MigrationRecord {
	id: DatabaseRecordId;
	name: string;
	timestamp: string;
}
