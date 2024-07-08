import { DatabaseFunctions } from '../functions';
import { ColumnType } from '../column';
import { Migration } from '../migration';

/**
 * Create a seed table to track seeded record IDs
 */
export class CreateSeedTable extends Migration {
	public override async up() {
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
					type: ColumnType.TIMESTAMP,
					default: DatabaseFunctions.currentTimestamp(),
				},
			],
		});
	}

	public override async down() {
		await this.ddl.dropTable({
			tables: 'riao_seed',
		});
	}
}
