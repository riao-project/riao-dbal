import { ColumnOptions } from '../column';
import { QueryRepository, QueryRepositoryOptions } from '../dml';
import { CreateTableOptions } from '../ddl';
import { Schema, SchemaTable, SchemaTableWithColumns } from '../schema';

import { RiaoSchemaColumnRecord, RiaoSchemaTableRecord } from './riao-schema-table';

import {
	DecimalColumnOptions,
	IntColumnOptions,
	VarCharColumnOptions,
} from '../column';

/**
 * Use the Schema Query Repository to query your schema information
 */
export class RiaoSchemaQueryRepository extends QueryRepository {
	protected tables: QueryRepository<RiaoSchemaTableRecord>;
	protected columns: QueryRepository<RiaoSchemaColumnRecord>;

	public constructor(options: QueryRepositoryOptions & {
		getQueryRepository: (options: QueryRepositoryOptions) => QueryRepository;
	}) {
		super(options);

		this.tables = options.getQueryRepository({
			table: 'riao_tables',
			identifiedBy: 'id',
			queryBuilderType: this.queryBuilderType,
		}) as QueryRepository<RiaoSchemaTableRecord>;

		this.columns = options.getQueryRepository({
			table: 'riao_columns',
			identifiedBy: 'id',
			queryBuilderType: this.queryBuilderType,
		}) as QueryRepository<RiaoSchemaColumnRecord>;
	}

	public async addTable(options: CreateTableOptions): Promise<number> {
		// TODO: Transaction
		let {id: tableId} = await this.tables.insertOne({
			record: { name: options.name }
		});

		tableId = parseInt(tableId as any, 10);

		await this.columns.insert({
			table: 'riao_columns',
			records: options.columns.map((col) => this.mapColumnToRecord(col, tableId)),
		});

		return tableId;
	}

	public async addColumn(
		options: ColumnOptions,
		tableId?: number
	): Promise<number> {
		if (!tableId) {
			// TODO: Get table
		}

		const { id: columnId } = await this.insertOne({
			table: 'riao_columns',
			record: this.mapColumnToRecord(options, tableId!),
		});

		return columnId;
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

	public async getTables(): Promise<SchemaTable[]> {
		const tables = await this.tables.find({});

		return tables.map(t => ({
			name: t.name,
			type: 'table',
		}));
	}

	public async getPrimaryKeyName(options: {
		table: string;
	}): Promise<undefined | string> {
		const table = await this.tables.findOne({ where: { name: options.table } });
		if (!table) {
			return undefined;
		}

		const pk = await this.columns.findOne({
			where: { table_id: table.id, is_primary_key: true }
		});

		return pk?.name;
	}

	public async getColumns(options: {
		table: string;
		primaryKey?: string;
	}): Promise<ColumnOptions[]> {
		const table = await this.tables.findOne({ where: { name: options.table } });
		if (!table) {
			return [];
		}

		const cols = await this.columns.find({ where: { table_id: table.id } });

		return cols.map(c => (<any>{
			name: c.name,
			type: c.data_type,
			primaryKey: c.is_primary_key,
			autoIncrement: c.is_auto_incrementing,
			required: c.is_required,
			isUnique: c.is_unique,
			length: c.data_length,
			significant: c.significant,
			decimal: c.decimal,
		}));
	}

	protected mapColumnToRecord(options: ColumnOptions, tableId: number): RiaoSchemaColumnRecord {
		return {
			table_id: parseInt(tableId as any, 10),
			name: options.name,
			data_type: options.type,
			data_length: (options as VarCharColumnOptions).length,
			significant: (options as DecimalColumnOptions).significant,
			decimal: (options as DecimalColumnOptions).decimal,
			is_primary_key: options.primaryKey ?? false,
			is_auto_incrementing:
				(options as IntColumnOptions).autoIncrement ?? false,
			is_required: options.required ?? false,
			is_unique: options.isUnique ?? false,
		};
	}
}
