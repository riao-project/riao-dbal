import { MigrationPackage, ImportedMigrations } from '../../src/migration';
import LibraryPackageMigration001 from './library/001-library-migration';

/**
 * A sample migration package that simulates a library export
 */
export class LibraryPackage extends MigrationPackage {
	public name = 'library-package';
	public package = 'lib';

	public async getMigrations(): Promise<ImportedMigrations> {
		return {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			'001-library-migration': LibraryPackageMigration001 as any,
		};
	}
}
