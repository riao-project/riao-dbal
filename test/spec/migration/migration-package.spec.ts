import 'jasmine';
import { TestDatabase } from '../../util/database';
import {
	Migration,
	MigrationRunner,
	MigrationPackage,
	PackagedMigrations,
} from '../../../src/migration';
import { TestDatabaseDriver } from '../../../test/util/driver';
import { ColumnType } from '../../../src/column';

describe('MigrationPackage', () => {
	let db: TestDatabase;
	let runner: MigrationRunner;

	beforeAll(async () => {
		db = new TestDatabase();
		await db.init();

		runner = new MigrationRunner(db);
	});

	beforeEach(async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();
	});

	it('can run a single migration package', async () => {
		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		// Create a simple package
		class SimplePackage extends MigrationPackage {
			public name = 'simple-package';
			public package = 'simple';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-package-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'simple_pkg_table',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'simple_pkg_table',
							});
						}
					} as typeof Migration,
				};
			}
		}

		const migrations = {
			'package-001': new SimplePackage(),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log);

		const logStr = logged.join('');
		expect(logStr).toContain(
			'Importing packaged migrations for simple-package'
		);
		expect(logStr).toContain('UP | 001-package-migration');
		expect(logStr).toContain('Migrations Complete!');

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).toContain('CREATE TABLE');
		expect(sql).toContain('simple_pkg_table');
	});

	it('can run nested migration packages (recursive)', async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();

		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		class NestedInnerPackage extends MigrationPackage {
			public name = 'inner-package';
			public package = 'inner';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-inner-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'inner_pkg_table',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'inner_pkg_table',
							});
						}
					} as typeof Migration,
				};
			}
		}

		class OuterPackage extends MigrationPackage {
			public name = 'outer-package';
			public package = 'outer';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-outer-migration':
						NestedInnerPackage as unknown as typeof Migration,
				};
			}
		}

		const migrations = {
			'package-001': new OuterPackage(),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log);

		const logStr = logged.join('');
		expect(logStr).toContain(
			'Importing packaged migrations for outer-package'
		);
		expect(logStr).toContain(
			'Importing packaged migrations for inner-package'
		);
		expect(logStr).toContain('UP | 001-inner-migration');
		expect(logStr).toContain('Migrations Complete!');

		const outerIdx = logStr.indexOf(
			'Importing packaged migrations for outer-package'
		);
		const innerIdx = logStr.indexOf(
			'Importing packaged migrations for inner-package'
		);
		expect(outerIdx).toBeLessThan(innerIdx);

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).toContain('inner_pkg_table');
	});

	it('can run multiple migrations in a package', async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();

		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		class MultiMigrationPackage extends MigrationPackage {
			public name = 'multi-package';
			public package = 'multi';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-first-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'multi_first_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'multi_first_tbl',
							});
						}
					} as typeof Migration,
					'002-second-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'multi_second_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'multi_second_tbl',
							});
						}
					} as typeof Migration,
				};
			}
		}

		const migrations = {
			'package-001': new MultiMigrationPackage(),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log);

		const logStr = logged.join('');
		expect(logStr).toContain(
			'Importing packaged migrations for multi-package'
		);
		expect(logStr).toContain('UP | 001-first-migration');
		expect(logStr).toContain('UP | 002-second-migration');
		expect(logStr).toContain('Migrations Complete!');

		const firstIdx = logStr.indexOf('UP | 001-first-migration');
		const secondIdx = logStr.indexOf('UP | 002-second-migration');
		expect(firstIdx).toBeLessThan(secondIdx);

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).toContain('multi_first_tbl');
		expect(sql).toContain('multi_second_tbl');
	});

	it('can mix packages and regular migrations', async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();

		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		class MixedPackage extends MigrationPackage {
			public name = 'mixed-package';
			public package = 'mixed';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-package-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'mixed_pkg_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'mixed_pkg_tbl',
							});
						}
					} as typeof Migration,
				};
			}
		}

		const migrations = {
			'001-user-migration': new (class extends Migration {
				async up() {
					await this.ddl.createTable({
						name: 'user_tbl',
						ifNotExists: true,
						columns: [
							{
								name: 'id',
								type: ColumnType.INT,
							},
						],
					});
				}

				async down() {
					await this.ddl.dropTable({
						tables: 'user_tbl',
					});
				}
			})(db),
			'002-package': new MixedPackage(),
			'003-another-user-migration': new (class extends Migration {
				async up() {
					await this.ddl.createTable({
						name: 'another_tbl',
						ifNotExists: true,
						columns: [
							{
								name: 'id',
								type: ColumnType.INT,
							},
						],
					});
				}

				async down() {
					await this.ddl.dropTable({
						tables: 'another_tbl',
					});
				}
			})(db),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log);

		const logStr = logged.join('');
		expect(logStr).toContain(
			'Importing packaged migrations for mixed-package'
		);
		expect(logStr).toContain('UP | 001-user-migration');
		expect(logStr).toContain('UP | 002-package');
		expect(logStr).toContain('UP | 003-another-user-migration');
		expect(logStr).toContain('Migrations Complete!');

		const user1Idx = logStr.indexOf('UP | 001-user-migration');
		const pkgIdx = logStr.indexOf('UP | 002-package');
		const user2Idx = logStr.indexOf('UP | 003-another-user-migration');
		expect(user1Idx).toBeLessThan(pkgIdx);
		expect(pkgIdx).toBeLessThan(user2Idx);

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).toContain('user_tbl');
		expect(sql).toContain('mixed_pkg_tbl');
		expect(sql).toContain('another_tbl');
	});

	it('tracks package migrations in migration table', async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();

		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		class TrackingPackage extends MigrationPackage {
			public name = 'tracking-package';
			public package = 'track';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-tracked-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'track_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'track_tbl',
							});
						}
					} as typeof Migration,
				};
			}
		}

		const migrations = {
			'001-package': new TrackingPackage(),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log);

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).toContain('INSERT INTO "riao_migration"');

		const logStr = logged.join('');
		expect(logStr).toContain(
			'Importing packaged migrations for tracking-package'
		);
		expect(logStr).toContain('UP | 001-tracked-migration');

		const params = (db.driver as TestDatabaseDriver).capturedParams;
		const tracked = params.find((p) => p === '001-tracked-migration');
		expect(tracked).toBeDefined();
	});

	it('handles package migration rollback', async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();

		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		class RollbackPackage extends MigrationPackage {
			public name = 'rollback-package';
			public package = 'rollback';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-rollback-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'rollback_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'rollback_tbl',
							});
						}
					} as typeof Migration,
				};
			}
		}

		const migrations = {
			'001-package': new RollbackPackage(),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log, 'down');

		const logStr = logged.join('');
		expect(logStr).toContain('All migrations have already run');

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).not.toContain('DROP TABLE "rollback_tbl"');
	});

	it('provides correct package metadata', async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();

		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		const packageName = 'my-library-package';

		class NamedPackage extends MigrationPackage {
			public name = packageName;
			public package = 'mylib';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-named-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'named_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'named_tbl',
							});
						}
					} as typeof Migration,
				};
			}
		}

		const migrations = {
			'001-package': new NamedPackage(),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log);

		const logStr = logged.join('');
		expect(logStr).toContain(
			`Importing packaged migrations for ${packageName}`
		);
		expect(logStr).toContain('UP | 001-named-migration');

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).toContain('named_tbl');
	});

	it('runs multiple package variants sequentially', async () => {
		await (db.driver as TestDatabaseDriver).resetTestCapture();

		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		class PackageVariant1 extends MigrationPackage {
			public name = 'variant-package';
			public package = 'v1';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-variant1-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'v1_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'v1_tbl',
							});
						}
					} as typeof Migration,
				};
			}
		}

		class PackageVariant2 extends MigrationPackage {
			public name = 'variant-package';
			public package = 'v2';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-variant2-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'v2_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'v2_tbl',
							});
						}
					} as typeof Migration,
				};
			}
		}

		const migrations = {
			'001-variant1': new PackageVariant1(),
			'002-variant2': new PackageVariant2(),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log);

		const logStr = logged.join('');
		expect(logStr).toContain('Importing packaged migrations');
		expect(logStr).toContain(
			'Importing packaged migrations for variant-package'
		);
		expect(logStr).toContain('UP | 001-variant1-migration');
		expect(logStr).toContain('UP | 001-variant2-migration');
		expect(logStr).toContain('Migrations Complete!');

		const var1Idx = logStr.indexOf('UP | 001-variant1-migration');
		const var2Idx = logStr.indexOf('UP | 001-variant2-migration');
		expect(var1Idx).toBeLessThan(var2Idx);

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).toContain('v1_tbl');
		expect(sql).toContain('v2_tbl');
	});

	it('only runs pending migrations within a package', async () => {
		const logged: string[] = [];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const log = (...args: any[]) => logged.push(args.join(''));

		class IdempotentPackage extends MigrationPackage {
			public name = 'idempotent-package';
			public package = 'idem';

			public async getMigrations(): Promise<PackagedMigrations> {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {
					'001-idempotent-migration': class extends Migration {
						async up() {
							await this.ddl.createTable({
								name: 'idem_tbl',
								ifNotExists: true,
								columns: [
									{
										name: 'id',
										type: ColumnType.INT,
									},
								],
							});
						}

						async down() {
							await this.ddl.dropTable({
								tables: 'idem_tbl',
							});
						}
					} as typeof Migration,
				};
			}
		}

		// Run with a package
		const migrations = {
			'001-pkg': new IdempotentPackage(),
		} as Record<string, Migration | MigrationPackage>;

		await runner.run(migrations, log);

		const logStr = logged.join('');
		expect(logStr).toContain(
			'Importing packaged migrations for idempotent-package'
		);
		expect(logStr).toContain('UP | 001-idempotent-migration');
		expect(logStr).toContain('Migrations Complete!');
		expect(logStr).not.toContain('All migrations have already run');

		const sql = (db.driver as TestDatabaseDriver).capturedSql;
		expect(sql).toContain('idem_tbl');
	});
});
