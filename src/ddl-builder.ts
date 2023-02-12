import { Builder } from './builder';
import { ColumnOptions } from './column-options';
import { ColumnType } from './column-type';
import { CreateTableOptions } from './create-table';
import { DropTableOptions } from './drop-table';

export class DataDefinitionBuilder extends Builder {
	protected dataTypes = ColumnType;

	// ------------------------------------------------------------------------
	// Create Table
	// ------------------------------------------------------------------------

	public createTableStatement(): this {
		this.sql += 'CREATE TABLE ';

		return this;
	}

	public ifNotExists(): this {
		this.sql += 'IF NOT EXISTS ';

		return this;
	}

	public createTableColumn(column: ColumnOptions): string {
		const length: null | number = 'length' in column ? column.length : null;

		let significant, decimal: null | number;
		if ('significant' in column && 'decimal' in column) {
			significant = column.significant;
			decimal = column.decimal;
		}

		const name = column.name;
		const type = this.dataTypes[column.type];

		let values;
		if ('enum' in column) {
			values = column.enum.map((val) => `'${val}'`).join(', ');
		}

		// e.g. `fname VARCHAR(120)`
		return (
			name +
			' ' +
			type +
			(length ? `(${length})` : '') +
			(significant ? `(${significant}, ${decimal})` : '') +
			(values ? `(${values})` : '')
		);
	}

	public createTableColumns(options: CreateTableOptions): this {
		this.sql += '(';
		this.sql += options.columns
			.map((column) => this.createTableColumn(column))
			.join(', ');

		this.sql += ')';

		return this;
	}

	public createTable(options: CreateTableOptions): this {
		this.createTableStatement();

		if (options.ifNotExists) {
			this.ifNotExists();
		}

		this.sql += options.name + ' ';

		this.createTableColumns(options);

		return this;
	}

	// ------------------------------------------------------------------------
	// Drop Table
	// ------------------------------------------------------------------------

	public dropTable(options: DropTableOptions): this {
		if (Array.isArray(options.names)) {
			options.names = options.names.join(',');
		}

		this.sql += 'DROP TABLE ';

		if (options.ifExists) {
			this.sql += 'IF EXISTS ';
		}

		this.sql += options.names;

		return this;
	}
}
