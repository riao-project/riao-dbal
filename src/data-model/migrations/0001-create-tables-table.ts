import { Migration } from '../../migration';
import { BigIntKeyColumn, NameColumn } from '../../column-pack';

export class CreateTablesTableMigration extends Migration {
	public async up(): Promise<void> {
		await this.ddl.createTable({
			name: 'riao_model_tables',
			columns: [BigIntKeyColumn, NameColumn],
		});
	}

	public async down(): Promise<void> {
		await this.ddl.dropTable({ tables: ['riao_model_tables'] });
	}
}
