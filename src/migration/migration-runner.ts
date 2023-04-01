import * as fs from 'fs';
import { join as joinPath, basename, extname } from 'path';
import { tsimport } from 'ts-import-ts';
import { Database } from '../database';
import { QueryRepository } from '../repository/query-repository';

import { CreateMigrationTable } from './create-migration-table';
import { Migration } from './migration';
import { MigrationRecord } from './migration-record';

/**
 * Runs migrations
 */
export class MigrationRunner {
	protected db: Database;

	public constructor(db: Database) {
		this.db = db;
	}

	/**
	 * Run migrations
	 *
	 * @param migrations (Optional) Folder to find migrations in. Default is
	 * 	db.getMigraitonDirectory()
	 * @param log (Optional) Log function. Defaults to console.log
	 */
	public async run(
		migrations?: string,
		log: (...args) => void = console.log
	): Promise<void> {
		if (!migrations) {
			migrations = this.db.getMigrationsDirectory();
		}

		// Create migration table, if not existing
		const createMigrationTable = new CreateMigrationTable(this.db);
		await createMigrationTable.up();

		// Query migrations that have already run
		const repo = new QueryRepository<MigrationRecord>(this.db.driver);
		const alreadyRanMigrations: MigrationRecord[] = await repo.find({
			columns: ['name'],
			table: 'migration',
		});
		const alreadyRanNames: string[] = alreadyRanMigrations.map(
			(migration) => migration.name
		);

		// Get migration files in folder
		const migrationsInPath = fs.readdirSync(migrations);

		if (!migrationsInPath.length) {
			log('No migrations found!');

			return;
		}

		// Check which migrations need to run
		const migrationsToRun = migrationsInPath.filter(
			(file) => !alreadyRanNames.includes(this.getMigrationName(file))
		);

		const nMigrationsToRun = migrationsToRun.length;

		if (!nMigrationsToRun) {
			log('All migrations have already run');

			return;
		}

		log(`Running ${migrationsToRun.length} migrations...`);

		// Run each migration
		for (const migrationFile of migrationsToRun) {
			// Get the migration path & name
			const path = joinPath(migrations, migrationFile);
			const name = this.getMigrationName(path);

			// Run the migration
			log('UP | ', name);

			const migrationType: typeof Migration = tsimport(path);
			const migration: Migration = new migrationType(this.db);

			await migration.up();

			// Save the migration record
			await repo.insert({
				table: 'migration',
				records: { name },
			});
		}

		log('Migrations complete');
	}

	protected getMigrationName(filename: string): string {
		return basename(filename.toLowerCase(), extname(filename));
	}
}
