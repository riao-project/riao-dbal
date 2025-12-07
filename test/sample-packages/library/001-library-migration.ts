import { ColumnType } from '../../../src/column';
import { Migration } from '../../../src/migration';

/**
 * Sample migration from library package
 */
export default class LibraryPackageMigration001 extends Migration {
	public override async up() {
		await this.ddl.createTable({
			name: 'library_table',
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
			tables: 'library_table',
		});
	}
}
