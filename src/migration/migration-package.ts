import { Migration } from './migration';

export type PackagedMigrations = Record<string, typeof Migration>;

export abstract class MigrationPackage {
	abstract name: string;
	abstract prefix: string;
	abstract getMigrations(): Promise<PackagedMigrations>;
}
