import { Migration } from './migration';

export type PackagedMigrations = Record<string, typeof Migration>;

/**
 * Create migration packages that can bundle multiple migrations together.
 * Useful for libraries that want to distribute migrations with their package.
 */
export abstract class MigrationPackage {
	/** The name of the package, used for logging */
	abstract name: string;

	/** The package identifier, used for storing migration records */
	abstract package: string;

	/** Override to provide the migrations included in this package */
	abstract getMigrations(): Promise<PackagedMigrations>;
}
