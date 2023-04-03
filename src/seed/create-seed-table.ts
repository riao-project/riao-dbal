import { ColumnType } from '../column-type';
import { Migration } from '../migration';

/**
 * Create a seed table to track seeded record IDs
 */
export class CreateSeedTable extends Migration {
	public async up() {
		await this.ddl.createTable({
			name: 'riao_seed',
			ifNotExists: true,
			columns: [
				{
					name: 'id',
					type: ColumnType.INT,
					autoIncrement: true,
					primaryKey: true,
				},
				{
					name: 'name',
					type: ColumnType.VARCHAR,
					length: 255,
				},
				{
					name: 'tableName',
					type: ColumnType.VARCHAR,
					length: 255,
				},
				{
					name: 'recordId',
					type: ColumnType.VARCHAR,
					length: 255,
				},
				{
					name: 'timestamp',
					type: ColumnType.DATETIME,
					// TODO: now() should be more abstract & cross-db compatible
					default: 'now()',
				},
			],
		});
	}

	public async down() {
		await this.ddl.dropTable({
			names: 'riao_seed',
		});
	}
}
