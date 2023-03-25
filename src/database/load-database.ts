import { Database } from './database';
import { join as joinPath } from 'path';
import { tsimport } from 'ts-import-ts';

export async function loadDatabase(
	databasePath: string,
	name: string
): Promise<Database> {
	const indexFilename = joinPath(databasePath, name);
	const dbClass: { new (name: string): Database } = tsimport(indexFilename);

	const db = new dbClass(name);
	db.databasePath = databasePath;

	await db.init();

	return db;
}
