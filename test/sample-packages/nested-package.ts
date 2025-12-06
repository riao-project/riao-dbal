import { MigrationPackage, ImportedMigrations } from '../../src/migration';
import NestedPackageMigration001 from './nested/001-nested-migration';

/**
 * A nested migration package to test recursion
 */
export class NestedPackage extends MigrationPackage {
	public name = 'nested-package';
	public prefix = 'nested';

	public async getMigrations(): Promise<ImportedMigrations> {
		return {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			'001-nested-migration': NestedPackageMigration001 as any,
		};
	}
}
