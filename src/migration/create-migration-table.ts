import { ColumnType } from '../column';
import { DatabaseFunctions } from '../functions';
import { Migration } from './migration';

/**
 * Create a migration table to track current-state
 */
export class CreateMigrationTable extends Migration {
	public async up() {
		await this.ddl.createTable({
			name: 'riao_migration',
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
					name: 'timestamp',
					type: ColumnType.TIMESTAMP,
					default: DatabaseFunctions.currentTimestamp(),
				},
			],
		});
	}

	public async down() {
		await this.ddl.dropTable({
			tables: 'riao_migration',
		});
	}
}
