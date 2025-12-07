import { ColumnType } from '../../../src/column';
import { Migration } from '../../../src/migration';

/**
 * Sample nested migration from package
 */
export default class NestedPackageMigration001 extends Migration {
	public override async up() {
		await this.ddl.createTable({
			name: 'nested_table',
			ifNotExists: true,
			columns: [
				{
					name: 'id',
					type: ColumnType.INT,
				},
			],
		});
	}

	public override async down() {
		await this.ddl.dropTable({
			tables: 'nested_table',
		});
	}
}
