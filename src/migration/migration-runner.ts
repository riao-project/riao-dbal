import * as fs from 'fs';
import { join as joinPath, basename, extname } from 'path';
import { QueryRepository } from '../repository/query-repository';

import { CreateMigrationTable } from './create-migration-table';
import { Migration } from './migration';
import { MigrationRecord } from './migration-record';

/**
 * Runs migrations
 */
export class MigrationRunner extends Migration {
	/**
	 * Run migrations
	 *
	 * @param migrations Folder to find migrations in
	 * @param log (Optional) Log function. Defaults to console.log
	 */
	public async run(
		migrations: string,
		log: (...args) => void = console.log
	): Promise<void> {
		// Create migration table, if not existing
		const createMigrationTable = new CreateMigrationTable(this.driver);
		await createMigrationTable.up();

		// Query migrations that have already run
		const repo = new QueryRepository<MigrationRecord>(this.driver);
		const alreadyRanMigrations: MigrationRecord[] = await repo.find({
			columns: ['name'],
			from: 'migrations',
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
			const path = joinPath(process.cwd(), migrations, migrationFile);
			const name = this.getMigrationName(path);

			// Run the migration
			log('UP | ', name);

			/* eslint-disable-next-line @typescript-eslint/no-var-requires */
			const migrationType: typeof Migration = require(path).default;
			const migration: Migration = new migrationType(this.driver);

			await migration.up();

			// Save the migration record
			await repo.insert({
				table: 'migrations',
				records: { name },
			});
		}

		log('Migrations complete');
	}

	protected getMigrationName(filename: string): string {
		return basename(filename.toLowerCase(), extname(filename));
	}
}
