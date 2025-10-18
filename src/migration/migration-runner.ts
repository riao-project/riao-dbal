import * as fs from 'fs';
import { join as joinPath, basename, extname } from 'path';
import { tsimport } from 'ts-import-ts';
import { Database } from '../database';

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
	 * @param direction (Optional) Run migrations up or down?
	 * @param steps (Optional) Run a certain number of steps?
	 */
	public async run(
		migrations?: string | Record<string, Migration>,
		/* eslint-disable-next-line no-console */
		log: (...args: any[]) => void = console.log,
		direction: 'up' | 'down' = 'up',
		steps?: number
	): Promise<void> {
		if (!migrations) {
			migrations = this.db.getMigrationsDirectory();
		}

		if (steps === -1) {
			steps = undefined;
		}

		if (steps !== undefined && steps < 0) {
			throw new Error('Steps must be a positive integer, or -1 for all.');
		}

		// Create migration table, if not existing
		const createMigrationTable = new CreateMigrationTable(this.db);
		await createMigrationTable.up();

		// Query migrations that have already run
		const repo = this.db.getQueryRepository<MigrationRecord>();
		const alreadyRanMigrations: MigrationRecord[] = await repo.find({
			columns: ['name'],
			table: 'riao_migration',
		});
		const alreadyRanNames: string[] = alreadyRanMigrations.map(
			(migration) => migration.name
		);

		if (typeof migrations === 'string') {
			// Get migration files in folder
			migrations = this.loadMigrationsFromDirectory(migrations);
		}

		const migrationNames: string[] = Object.keys(migrations);

		if (!migrationNames.length) {
			log('No migrations found!');

			return;
		}

		// Check which migrations need to run
		let migrationsToRun: string[];

		if (direction === 'up') {
			migrationsToRun = migrationNames.filter(
				(file) => !alreadyRanNames.includes(file)
			);
		}
		else {
			migrationsToRun = alreadyRanNames.reverse();
		}

		if (!migrationsToRun.length) {
			log('All migrations have already run');

			return;
		}

		log(
			`Discovered ${migrationsToRun.length} ` +
				'pending migrations in this direction.'
		);

		if (steps !== undefined) {
			migrationsToRun = migrationsToRun.slice(0, steps);
		}

		log(`Running ${migrationsToRun.length} migrations...`);

		// Run each migration
		for (const name of migrationsToRun) {
			// Run the migration
			log(direction.toLocaleUpperCase() + ' | ', name);

			const migration: Migration = migrations[name];

			await migration[direction]();

			// Save the migration record
			if (direction === 'up') {
				await repo.insert({
					table: 'riao_migration',
					records: { name },
				});
			}
			else {
				await repo.delete({
					table: 'riao_migration',
					where: { name },
				});
			}
		}

		log('Rebuilding Schema...');

		await this.db.buildSchema();

		log('Migrations Complete!');
	}

	protected getMigrationName(filename: string): string {
		return basename(filename.toLowerCase(), extname(filename));
	}

	protected loadMigration(dir: string, filename: string): Migration {
		const path = joinPath(dir, filename);
		const migrationType: typeof Migration = tsimport(path);
		const migration: Migration = new migrationType(this.db);

		return migration;
	}

	protected loadMigrationsFromDirectory(
		dir: string
	): Record<string, Migration> {
		return fs
			.readdirSync(dir)
			.filter((filename) => /\.ts$/.test(filename))
			.map((filename) => ({
				name: this.getMigrationName(filename),
				migration: this.loadMigration(dir, filename),
			}))
			.reduce((obj, item) => {
				obj[item.name] = item.migration;

				return obj;
			}, {});
	}
}
