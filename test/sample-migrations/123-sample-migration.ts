import { ColumnType } from '../../src/column';
import { Migration } from '../../src/migration';

/**
 * Sample table migration
 */
export default class SampleMigrationTable extends Migration {
	public async up() {
		await this.ddl.createTable({
			name: 'sample',
			ifNotExists: true,
			columns: [
				{
					name: 'id',
					type: ColumnType.INT,
				},
			],
		});
	}

	public async down() {
		await this.ddl.dropTable({
			tables: 'sample',
		});
	}
}
