import { ColumnType } from '../column';
import { Migration } from '../migration';

export class CreateRiaoSchemaTables extends Migration {
	public async up() {
		await this.ddl.createTable({
			name: 'riao_tables',
			ifNotExists: true,
			columns: [
				{
					name: 'id',
					type: ColumnType.INT,
					primaryKey: true,
					autoIncrement: true,
				},
				{
					name: 'name',
					type: ColumnType.VARCHAR,
					length: 255,
					isUnique: true,
				},
				{
					name: 'primary_key',
					type: ColumnType.VARCHAR,
					length: 255,
				}
			],
		});

		await this.ddl.createTable({
			name: 'riao_columns',
			ifNotExists: true,
			columns: [
				{
					name: 'id',
					type: ColumnType.INT,
					primaryKey: true,
					autoIncrement: true,
				},
				{
					name: 'table_id',
					type: ColumnType.INT,
				},
				{
					name: 'name',
					type: ColumnType.VARCHAR,
					length: 255,
				},
				{
					name: 'data_type',
					type: ColumnType.VARCHAR,
					length: 255,
				},
				{
					name: 'data_length',
					type: ColumnType.INT,
				},
				{
					name: 'significant',
					type: ColumnType.SMALLINT,
				},
				{
					name: 'decimal',
					type: ColumnType.SMALLINT,
				},
				{
					name: 'is_primary_key',
					type: ColumnType.BOOL,
				},
				{
					name: 'is_auto_incrementing',
					type: ColumnType.BOOL,
				},
				{
					name: 'is_not_null',
					type: ColumnType.BOOL,
				},
				{
					name: 'is_unique',
					type: ColumnType.BOOL,
				},
			],
		});
	}

	public async down() {
		await this.ddl.dropTable({ tables: ['riao_tables', 'riao_columns'] });
	}
}
