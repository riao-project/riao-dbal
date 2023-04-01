import * as fs from 'fs';
import { join as joinPath, basename, extname } from 'path';
import { tsimport } from 'ts-import-ts';
import { Database } from '../database';

import { CreateSeedTable } from './create-seed-table';
import { Seed } from './seed';

/**
 * Runs seeds
 */
export class SeedRunner {
	protected db: Database;

	public constructor(db: Database) {
		this.db = db;
	}

	/**
	 * Run seeds
	 *
	 * @param seeds (Optional) Folder to find seeds in. Default is
	 * 	db.getSeedsDirectory()
	 * @param log (Optional) Log function. Defaults to console.log
	 * @param direction (Optional) Run seeds up or down?
	 */
	public async run(
		seeds?: string,
		log: (...args) => void = console.log,
		direction: 'up' | 'down' = 'up'
	): Promise<void> {
		if (!seeds) {
			seeds = this.db.getSeedsDirectory();
		}

		// Create seed table, if not existing
		const createSeedTable = new CreateSeedTable(this.db);
		await createSeedTable.up();

		// Get seed files in folder
		const seedsInPath = fs.readdirSync(seeds);

		if (!seedsInPath.length) {
			log('No seeds found!');

			return;
		}

		log(`Running ${seedsInPath.length} seeds...`);

		if (direction === 'down') {
			seedsInPath.reverse();
		}

		// Run each seed
		for (const seedFile of seedsInPath) {
			// Get the seed path & name
			const path = joinPath(seeds, seedFile);
			const name = this.getSeedName(path);

			// Run the seed
			log(direction.toLocaleUpperCase() + ' | ', name);

			const seedType: typeof Seed = tsimport(path);
			const seed: Seed = new seedType(this.db);

			await seed[direction]();
		}

		log('Seeds complete');
	}

	protected getSeedName(filename: string): string {
		return basename(filename.toLowerCase(), extname(filename));
	}
}
