import { Migration } from '../../migration';
import { BigIntKeyColumn, NameColumn } from '../../column-pack';
import { ColumnType } from '../../column';

export class CreateColumnsTableMigration extends Migration {
	public async up(): Promise<void> {
		await this.ddl.createTable({
			name: 'riao_model_columns',
			columns: [
				BigIntKeyColumn,
				{
					name: 'table_id',
					type: ColumnType.BIGINT,
					required: true,
					fk: {
						referencesTable: 'riao_model_tables',
						referencesColumn: 'id',
						onDelete: 'CASCADE',
					},
				},
				NameColumn,
				{
					name: 'data_type',
					type: ColumnType.VARCHAR,
					required: true,
					length: 100,
				},
				{
					name: 'default_value_type',
					// 'none' | 'null' | 'literal' | 'function' | 'expression'
					type: ColumnType.VARCHAR,
					required: true,
					length: 50,
				},
				{
					name: 'default_value',
					type: ColumnType.TEXT,
					required: false,
				},
				{
					name: 'is_primary_key',
					type: ColumnType.BOOL,
					required: true,
					default: false,
				},
				{
					name: 'is_required',
					type: ColumnType.BOOL,
					required: true,
					default: false,
				},
				{
					name: 'is_unique',
					type: ColumnType.BOOL,
					required: true,
					default: false,
				},
				{
					name: 'references_table',
					type: ColumnType.VARCHAR,
					required: false,
					length: 255,
				},
				{
					name: 'references_column',
					type: ColumnType.VARCHAR,
					required: false,
					length: 255,
				},
			],
		});
	}

	public async down(): Promise<void> {
		await this.ddl.dropTable({ tables: ['riao_model_columns'] });
	}
}
