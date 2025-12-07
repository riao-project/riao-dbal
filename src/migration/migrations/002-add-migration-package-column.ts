import { ColumnType } from '../../column';
import { Migration } from './../migration';

/**
 * Add a migration package column to the migration table so that
 *  migrations can be scoped by package
 */
export class AddMigrationPackageColumn extends Migration {
	public override async up() {
		await this.ddl.addColumns({
			table: 'riao_migration',
			columns: [
				{
					name: 'package',
					type: ColumnType.VARCHAR,
					length: 255,
					default: null,
				},
			],
		});
	}

	public override async down() {
		await this.ddl.dropColumn({
			table: 'riao_migration',
			column: 'package',
		});
	}
}
