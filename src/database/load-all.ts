import { readdirSync } from 'fs';
import { Database } from './database';
import { getDatabasePath } from './get-database-path';
import { loadDatabase } from './load-database';

export type DatabaseByName = { [name: string]: Database };

/**
 * Load all databases from a folder
 *
 * @param databasePath Path to databases (e.g. `database/`)
 * @returns Returns all databases in the path, by name
 */
export async function loadAll(databasePath?: string): Promise<DatabaseByName> {
	if (!databasePath) {
		databasePath = getDatabasePath();
	}

	const dbNames = readdirSync(databasePath).filter(
		(name) => !name.includes('.')
	);
	const databases: DatabaseByName = {};

	for (const dbName of dbNames) {
		databases[dbName] = await loadDatabase(databasePath, dbName);
	}

	return databases;
}
