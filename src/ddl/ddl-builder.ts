import { Builder } from '../builder';
import { BaseIntColumnOptions, ColumnOptions } from '../column-options';
import { ColumnType } from '../column-type';
import { AddColumnsOptions } from './alter-table';
import { CreateTableOptions } from './create-table';
import { DropTableOptions } from './drop-table';
import {
	ForeignKeyConstraint,
	ForeignKeyReferenceOption,
} from './foreign-key-constraint';
import { TruncateOptions } from './truncate';

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

		let defaultValue = '';
		if (column.default) {
			defaultValue = ' DEFAULT ' + column.default;
		}

		const autoIncrement = (column as BaseIntColumnOptions).autoIncrement
			? ' AUTO_INCREMENT'
			: '';

		// e.g. `fname VARCHAR(120)`
		return (
			name +
			' ' +
			type +
			(length ? `(${length})` : '') +
			(significant ? `(${significant}, ${decimal})` : '') +
			(values ? `(${values})` : '') +
			defaultValue +
			autoIncrement
		);
	}

	public createTableColumns(options: CreateTableOptions): this {
		this.sql += '(';
		this.sql += options.columns
			.map((column) => this.createTableColumn(column))
			.join(', ');

		const primaryKeys: string[] = options.columns
			.filter((column) => column.primaryKey)
			.map((column) => column.name);

		if (primaryKeys.length > 0) {
			this.sql += ', PRIMARY KEY (' + primaryKeys.join(',') + ')';
		}

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
		this.sql += ' ';

		for (const fk of options.foreignKeys ?? []) {
			this.foreignKeyConstraint(options.name, fk);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Foreign Key Constraint
	// ------------------------------------------------------------------------

	public foreignKeyStatement(): this {
		this.sql += 'FOREIGN KEY ';

		return this;
	}

	public foreignKeyName(childTable: string, fk: ForeignKeyConstraint): this {
		this.sql += fk.name ?? `fk_${childTable}_${fk.columns.join('_')}`;
		this.sql += ' ';

		return this;
	}

	public foreignKeyColumns(columns: string[]): this {
		this.openParens();
		this.commaSeparate(columns);
		this.closeParens();

		return this;
	}

	public referencesStatement(table: string, columns: string[]): this {
		this.sql += `REFERENCES ${table}`;

		this.openParens();
		this.commaSeparate(columns);
		this.closeParens();

		return this;
	}

	public fkOnUpdate(option: ForeignKeyReferenceOption): this {
		this.sql += 'ON UPDATE ' + option + ' ';

		return this;
	}

	public fkOnDelete(option: ForeignKeyReferenceOption): this {
		this.sql += 'ON DELETE ' + option + ' ';

		return this;
	}

	public foreignKeyConstraint(childTable: string, fk: ForeignKeyConstraint) {
		this.foreignKeyStatement();
		this.foreignKeyName(childTable, fk);
		this.foreignKeyColumns(fk.columns);
		this.referencesStatement(fk.referencesTable, fk.referencesColumns);

		if (fk.onUpdate) {
			this.fkOnUpdate(fk.onUpdate);
		}

		if (fk.onDelete) {
			this.fkOnDelete(fk.onDelete);
		}
	}

	// ------------------------------------------------------------------------
	// Alter Table
	// ------------------------------------------------------------------------

	public alterTableStatement(table: string): this {
		this.sql += 'ALTER TABLE ' + table + ' ';

		return this;
	}

	public addColumns(options: AddColumnsOptions): this {
		this.alterTableStatement(options.table);

		this.sql += 'ADD COLUMN ';
		this.openParens();
		this.commaSeparate(
			options.columns.map((column) => this.createTableColumn(column))
		);
		this.closeParens();

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

	// ------------------------------------------------------------------------
	// Truncate Table
	// ------------------------------------------------------------------------

	public truncate(options: TruncateOptions): this {
		this.sql += 'TRUNCATE ' + options.name;

		return this;
	}
}
