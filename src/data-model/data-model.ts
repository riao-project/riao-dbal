import { Database } from '../database';
import { QueryRepository } from '../dml';
import { identifier } from '../expression/identifier';

import { DataModelTable } from './data-model-table';
import { DataModelColumn } from './data-model-column';
import { Migration } from 'src/migration';
import {
	CreateTablesTableMigration,
	CreateColumnsTableMigration,
} from './migrations';

export class DataModelRepository {
	protected tablesTable = 'riao_model_tables';
	protected columnsTable = 'riao_model_columns';

	protected db: Database;
	protected tables: QueryRepository<DataModelTable>;
	protected columns: QueryRepository<DataModelColumn>;

	public constructor(options: { db: Database }) {
		this.db = options.db;

		this.tables = this.db.getQueryRepository<DataModelTable>({
			table: this.tablesTable,
		});

		this.columns = this.db.getQueryRepository<DataModelColumn>({
			table: this.columnsTable,
		});
	}

	public async getTableModel(
		table: string
	): Promise<null | DataModelColumn[]> {
		return await this.columns.find({
			where: <any>{ [`${this.tablesTable}.name`]: table },
			join: [
				{
					type: 'INNER',
					table: this.tablesTable,
					on: {
						[`${this.columnsTable}.table_id`]: identifier(
							`${this.tablesTable}.id`
						),
					},
				},
			],
		});
	}

	public async createTable(
		table: Omit<DataModelTable, 'id'>
	): Promise<number> {
		const result = await this.tables.insertOne({ record: table });

		return result.id;
	}

	public async createColumn(
		column: Omit<DataModelColumn, 'id'>
	): Promise<number> {
		const result = await this.columns.insertOne({ record: column });

		return result.id;
	}

	public async getMigrations(): Promise<
		Record<string, typeof Migration<any>>
		> {
		return {
			'0001-create-tables-table': CreateTablesTableMigration,
			'0002-create-columns-table': CreateColumnsTableMigration,
		};
	}
}
