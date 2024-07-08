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
	 * @param steps (Optional) Run a certain number of steps?
	 * @param seed (Optional) Seed file to run
	 */
	public async run(
		seeds?: string,
		/* eslint-disable-next-line no-console */
		log: (...args: any[]) => void = console.log,
		direction: 'up' | 'down' = 'up',
		steps?: number,
		seed?: string
	): Promise<void> {
		if (!seeds) {
			seeds = this.db.getSeedsDirectory();
		}

		if (steps === -1) {
			steps = undefined;
		}

		if (steps !== undefined && steps < 0) {
			throw new Error('Steps must be a positive integer, or -1 for all.');
		}

		// Create seed table, if not existing
		const createSeedTable = new CreateSeedTable(this.db);
		await createSeedTable.up();

		// Get seed files in folder
		let seedsInPath = fs
			.readdirSync(seeds)
			.filter((fname) => /\.ts$/.test(fname));

		if (!seedsInPath.length) {
			log('No seeds found!');

			return;
		}

		log(`Discovered ${seedsInPath.length} seeds.`);

		if (seed) {
			if (!seedsInPath.includes(seed)) {
				throw new Error(`Seed ${seed} not found in seeds folder`);
			}

			seedsInPath = [seed];
		}

		if (direction === 'down') {
			seedsInPath.reverse();
		}

		if (steps !== undefined) {
			seedsInPath = seedsInPath.slice(0, steps);
		}

		log(`Running ${seedsInPath.length} seeds...`);

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
