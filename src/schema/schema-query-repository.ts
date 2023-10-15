import { DatabaseRecord } from '../record';
import { ColumnOptions } from '../column';
import { DatabaseQueryBuilder, QueryRepository } from '../dml';
import { SchemaTable, SchemaTableWithColumns } from './schema-table';
import { Schema } from './schema';
import { RepositoryInit, RepositoryOptions } from '../repository';

export interface SchemaQueryRepositoryOptions extends RepositoryOptions {
	queryBuilderType: typeof DatabaseQueryBuilder;
}

export interface SchemaQueryRepositoryInit extends RepositoryInit {
	database: string;
}

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

	protected returnedTableTypes: Record<any, 'table' | 'view'> = {
		'BASE TABLE': 'table',
		VIEW: 'view',
	};

	public constructor(options: SchemaQueryRepositoryOptions) {
		super(options);
	}

	public init(options: SchemaQueryRepositoryInit) {
		super.init(options);

		this.database = options.database;
	}

	public async getSchema(): Promise<Schema> {
		const tables = await this.getTablesWithColumns();
		const mappedTables: Record<string, SchemaTableWithColumns> = {};

		for (const table of tables) {
			mappedTables[table.name] = table;
		}

		return {
			tables: mappedTables,
		};
	}

	protected getTablesQueryWhere() {
		return { [this.databaseNameColumn]: this.database };
	}

	protected async getTablesQuery(): Promise<DatabaseRecord[]> {
		return await this.find({
			table: this.tablesTable,
			columns: [this.tableNameColumn, this.tableTypeColumn],
			where: this.getTablesQueryWhere(),
		});
	}

	protected getTablesResultParser(tables: DatabaseRecord) {
		return tables.map((table) => ({
			name: table[this.tableNameColumn],
			type: this.returnedTableTypes[table[this.tableTypeColumn]],
		}));
	}

	public async getTables(): Promise<SchemaTable[]> {
		const results = await this.getTablesQuery();

		return this.getTablesResultParser(results);
	}

	public async getTablesWithColumns(): Promise<SchemaTableWithColumns[]> {
		const tables = await this.getTables();
		const out = [];

		for (const table of tables) {
			const tableName = table.name;

			const primaryKey = await this.getPrimaryKeyName({
				table: tableName,
			});

			const columns = await this.getColumns({
				table: tableName,
				primaryKey,
			});

			const mappedColumns: Record<string, ColumnOptions> = {};

			for (const column of columns) {
				mappedColumns[column.name] = column;
			}

			out.push({
				name: tableName,
				type: table.type,
				columns: mappedColumns,
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

	public async getPrimaryKeyName(options: {
		table: string;
	}): Promise<null | string> {
		const result = await this.getPrimaryKeyQuery(options.table);

		return this.getPrimaryKeyResultParser(result);
	}

	protected async getColumnsQuery(table: string): Promise<DatabaseRecord[]> {
		return await this.find({
			table: this.columnsTable,
			columns: [this.columnNameColumn, this.columnTypeColumn],
			where: {
				[this.databaseNameColumn]: this.database,
				[this.tableNameColumn]: table,
			},
			orderBy: { [this.columnPositionColumn]: 'ASC' },
		});
	}

	protected getColumnsResultParser(options: {
		records: DatabaseRecord[];
		primaryKey: string;
	}): ColumnOptions[] {
		return options.records.map((column) => ({
			name: column[this.columnNameColumn],
			type: column[this.columnTypeColumn]
				.toUpperCase()
				.replace('CHARACTER VARYING', 'VARCHAR'),
			primaryKey: column[this.columnNameColumn] === options.primaryKey,
		}));
	}

	public async getColumns(options: {
		table: string;
		primaryKey?: string;
	}): Promise<ColumnOptions[]> {
		const primaryKey =
			options.primaryKey ??
			(await this.getPrimaryKeyName({ table: options.table }));

		const results = await this.getColumnsQuery(options.table);

		return this.getColumnsResultParser({
			records: results,
			primaryKey: primaryKey,
		});
	}
}
