import { DatabaseRecord } from '../record';
import { ColumnOptions } from '../column';
import { QueryRepository, QueryRepositoryOptions } from '../dml';
import { SchemaTable } from './schema-table';

/**
 * Use the Schema Query Repository to query your schema information
 */
export class SchemaQueryRepository extends QueryRepository {
	protected database: string;

	protected tablesTable = 'information_schema.tables';
	protected columnsTable = 'information_schema.columns';

	protected databaseNameColumn = 'TABLE_SCHEMA';
	protected tableNameColumn = 'TABLE_NAME';
	protected tableTypeColumn = 'TABLE_TYPE';
	protected columnNameColumn = 'COLUMN_NAME';
	protected columnTypeColumn = 'DATA_TYPE';
	protected columnPositionColumn = 'ORDINAL_POSITION';

	protected returnedTableTypes = {
		'BASE TABLE': 'table',
		VIEW: 'view',
	};

	public constructor(options: QueryRepositoryOptions & { database: string }) {
		super(options);
		this.database = options.database;
	}

	protected getTablesWhere() {
		return { [this.databaseNameColumn]: this.database };
	}

	protected async getRawTables(): Promise<SchemaTable[]> {
		return <SchemaTable[]>await this.find({
			table: this.tablesTable,
			columns: [this.tableNameColumn, this.tableTypeColumn],
			where: this.getTablesWhere(),
		});
	}

	public async getTables(): Promise<SchemaTable[]> {
		const tables = await this.getRawTables();
		const out = [];

		for (const table of tables) {
			const tableName = table[this.tableNameColumn];

			const primaryKey = await this.getPrimaryKey({
				table: tableName,
			});

			const columns = await this.getColumns({
				table: tableName,
				primaryKey,
			});

			out.push({
				name: tableName,
				type: this.returnedTableTypes[table[this.tableTypeColumn]],
				columns,
				primaryKey,
			});
		}

		return out;
	}

	protected getPrimaryKeyResultParser(
		result: null | DatabaseRecord
	): null | string {
		return result?.[this.columnNameColumn] || null;
	}

	protected async getPrimaryKeyQuery(
		table: string
	): Promise<null | DatabaseRecord> {
		return await this.findOne({
			table: this.columnsTable,
			columns: [this.columnNameColumn],
			where: {
				[this.databaseNameColumn]: this.database,
				[this.tableNameColumn]: table,
				COLUMN_KEY: 'PRI',
			},
		});
	}

	public async getPrimaryKey(options: {
		table: string;
	}): Promise<null | string> {
		const result = await this.getPrimaryKeyQuery(options.table);

		return this.getPrimaryKeyResultParser(result);
	}

	public async getColumns(options: {
		table: string;
		primaryKey?: string;
	}): Promise<ColumnOptions[]> {
		const primaryKey =
			options.primaryKey ??
			(await this.getPrimaryKey({ table: options.table }));

		return <ColumnOptions[]>(
			await this.find({
				table: this.columnsTable,
				columns: [this.columnNameColumn, this.columnTypeColumn],
				where: {
					[this.databaseNameColumn]: this.database,
					[this.tableNameColumn]: options.table,
				},
				orderBy: { [this.columnPositionColumn]: 'ASC' },
			})
		).map((column) => ({
			name: column[this.columnNameColumn],
			type: column[this.columnTypeColumn]
				.toUpperCase()
				.replace('CHARACTER VARYING', 'VARCHAR'),
			primaryKey: column[this.columnNameColumn] === primaryKey,
		}));
	}
}
