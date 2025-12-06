import * as fs from 'fs';
import { join as joinPath, basename, extname } from 'path';
import { tsimport } from 'ts-import-ts';
import { Database } from '../database';

import { CreateMigrationTable } from './migrations/001-create-migration-table';
import { Migration } from './migration';
import { MigrationRecord } from './migration-record';
import { MigrationPackage } from './migration-package';
import { AddMigrationPackageColumn } from './migrations/002-add-migration-package-column';

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
	 * @deprecated This method will change parameters in a future release.
	 * 	Switch to runWithOptions() to prepare for this change.
	 *
	 * @param migrations (Optional) Folder to find migrations in. Default is
	 * 	db.getMigraitonDirectory()
	 * @param log (Optional) Log function. Defaults to console.log
	 * @param direction (Optional) Run migrations up or down?
	 * @param steps (Optional) Run a certain number of steps?
	 */
	public async run(
		migrations?: string | Record<string, Migration | MigrationPackage>,
		/* eslint-disable-next-line no-console */
		log: (...args: any[]) => void = console.log,
		direction: 'up' | 'down' = 'up',
		steps?: number
	): Promise<void> {
		return await this.runWithOptions({
			migrations,
			log,
			direction,
			steps,
		});
	}

	public async runWithOptions(options: {
		migrations?: string | Record<string, Migration | MigrationPackage>;
		log?: (...args: any[]) => void;
		direction?: 'up' | 'down';
		steps?: number;
		package?: string;
	}): Promise<void> {
		let migrations = options.migrations || this.db.getMigrationsDirectory();

		// eslint-disable-next-line no-console
		const log = options.log || console.log;
		const direction = options.direction || 'up';
		let steps = options.steps;
		const pkg = options.package || null;

		if (steps === -1) {
			steps = undefined;
		}

		if (steps !== undefined && steps < 0) {
			throw new Error('Steps must be a positive integer, or -1 for all.');
		}

		// Create migration table, if not existing
		await this.runRiaoDbalMigrations();

		// Query migrations that have already run
		const repo = this.db.getQueryRepository<MigrationRecord>();
		const alreadyRanMigrations: MigrationRecord[] = await repo.find({
			columns: ['name'],
			table: 'riao_migration',
			where: { package: pkg ? pkg : null },
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

			const migration: Migration | MigrationPackage = migrations[name];

			if (migration instanceof MigrationPackage) {
				log(
					'Importing packaged migrations for ' +
						migration.name +
						'...'
				);

				const importedMigrationTypes = await migration.getMigrations();
				const PackagedMigrations = Object.keys(
					importedMigrationTypes
				).reduce((obj, key) => {
					const migrationType = importedMigrationTypes[key];
					obj[key] = new migrationType(this.db);

					return obj;
				}, {} as Record<string, Migration>);

				await this.runWithOptions({
					...options,
					steps: undefined,
					migrations: PackagedMigrations,
					package: migration.package,
				});

				continue;
			}

			await migration[direction]();

			// Save the migration record
			if (direction === 'up') {
				await repo.insert({
					table: 'riao_migration',
					records: { name, package: pkg ? pkg : null },
				});
			}
			else {
				await repo.delete({
					table: 'riao_migration',
					where: { name, package: pkg ? pkg : null },
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

	protected async runRiaoDbalMigrations(): Promise<void> {
		// Create table, if not existing
		const createMigrationTable = new CreateMigrationTable(this.db);
		await createMigrationTable.up();

		// Check if `package` column exists, and if not, add it
		const columns = await this.db
			.getSchemaQueryRepository()
			.getColumns({ table: 'riao_migration' });

		if (!columns.find((col) => col.name === 'package')) {
			const addMigrationPackageColumn = new AddMigrationPackageColumn(
				this.db
			);

			await addMigrationPackageColumn.up();
		}
	}
}
