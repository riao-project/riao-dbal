import { Database } from './database';
import { join as joinPath } from 'path';
import { tsimport } from 'ts-import-ts';
import { getDatabasePath } from './get-database-path';

export async function loadDatabase(
	databasePath?: string,
	name = 'main'
): Promise<Database> {
	if (!databasePath) {
		databasePath = getDatabasePath();
	}

	const indexFilename = joinPath(databasePath, name);
	const dbClass: { new (name: string): Database } = tsimport(indexFilename);

	const db = new dbClass(name);
	db.databasePath = databasePath;

	await db.init();

	return db;
}
