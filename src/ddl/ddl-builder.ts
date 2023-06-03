import { Builder } from '../builder';
import { BaseIntColumnOptions, ColumnOptions, ColumnType } from '../column';
import {
	AddColumnsOptions,
	AddForeignKeyOptions,
	ChangeColumnOptions,
	DropColumnOptions,
	DropForeignKeyOptions,
	RenameColumnOptions,
	RenameTableOptions,
} from './alter-table';
import { CreateDatabaseOptions } from './create-database';
import { CreateTableOptions } from './create-table';
import { CreateUserOptions } from './create-user';
import { DropDatabaseOptions } from './drop-database';
import { DropTableOptions } from './drop-table';
import { DropUserOptions } from './drop-user';
import {
	ForeignKeyConstraint,
	ForeignKeyReferenceOption,
} from './foreign-key-constraint';
import { GrantOn, GrantOptions } from './grant';
import { TruncateOptions } from './truncate';

export class DataDefinitionBuilder extends Builder {
	protected columnTypes = ColumnType;

	// ------------------------------------------------------------------------
	// Create Database
	// ------------------------------------------------------------------------

	public createDatabaseStatement(): this {
		this.sql += 'CREATE DATABASE ';

		return this;
	}

	public createDatabase(options: CreateDatabaseOptions): this {
		this.createDatabaseStatement();
		this.sql += options.name;

		return this;
	}

	// ------------------------------------------------------------------------
	// Create User
	// ------------------------------------------------------------------------

	public createUserStatement(): this {
		this.sql += 'CREATE USER ';

		return this;
	}

	public createUserPassword(password: string): this {
		this.sql += `WITH PASSWORD '${password}' `;

		return this;
	}

	public createUser(options: CreateUserOptions): this {
		this.createUserStatement();
		this.sql += options.name + ' ';

		if (options.password) {
			this.createUserPassword(options.password);
		}

		return this;
	}

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

	public getAutoIncrement(): string {
		return 'AUTO_INCREMENT';
	}

	public createTableColumn(column: ColumnOptions): string {
		const length: null | number = 'length' in column ? column.length : null;

		let significant, decimal: null | number;
		if ('significant' in column && 'decimal' in column) {
			significant = column.significant;
			decimal = column.decimal;
		}

		const name = column.name;
		const type = this.columnTypes[column.type];

		let values;
		if ('enum' in column) {
			values = column.enum.map((val) => `'${val}'`).join(', ');
		}

		let defaultValue = '';
		if (column.default === null) {
			column.default = 'NULL';
		}

		if (column.default) {
			defaultValue = ' DEFAULT ' + column.default;
		}

		const autoIncrement = (column as BaseIntColumnOptions).autoIncrement
			? ' ' + this.getAutoIncrement()
			: '';

		// e.g. `fname VARCHAR(120)`
		return (
			name +
			' ' +
			type +
			(length ? `(${length})` : '') +
			(significant ? `(${significant}, ${decimal})` : '') +
			(values ? `(${values})` : '') +
			(column.notNull ? ' NOT NULL' : '') +
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

		for (const fk of options.foreignKeys ?? []) {
			this.sql += ', ';
			this.foreignKeyConstraint(options.name, fk);
		}

		this.trimEnd(' ');

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

	public constraintStatement(): this {
		this.sql += 'CONSTRAINT ';

		return this;
	}

	// ------------------------------------------------------------------------
	// Grant permissions
	// ------------------------------------------------------------------------

	public grantOnDatabase(database: string): this {
		this.sql += database + '.*';

		return this;
	}

	public grantOn(on: GrantOn): this {
		if (on === '*') {
			this.sql += '*.*';
		}
		else if ('database' in on && 'table' in on) {
			this.sql += `${on.database}.${on.table}`;
		}
		else if ('database' in on) {
			this.grantOnDatabase(on.database);
		}

		this.sql += ' ';

		return this;
	}

	/**
	 * IMPORTANT: UNSTABLE. Grant is currently only compatible with
	 * 	mysql and mssql and may cause unintended side-effects and/or
	 * 	privilege escalation.
	 * This should not be used in most circumstances!
	 * Use a dedicated database connection for this method, as it may change
	 * 	the database connection's default database.
	 * This method and it's arguments are likely to change in future versions
	 *
	 * @param options Grant options
	 * @returns
	 */
	public grant(options: GrantOptions): this {
		if (!Array.isArray(options.privileges)) {
			options.privileges = [options.privileges];
		}

		if (!Array.isArray(options.to)) {
			options.to = [options.to];
		}

		this.sql += 'GRANT ';
		this.sql += options.privileges.join(', ') + ' ';
		this.sql += 'ON ';
		this.grantOn(options.on);

		this.sql += 'TO ' + options.to.join(', ') + ' ';

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
		this.constraintStatement();
		this.foreignKeyName(childTable, fk);
		this.foreignKeyStatement();
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

		this.sql += 'ADD ';
		this.commaSeparate(
			options.columns.map((column) => this.createTableColumn(column))
		);

		return this;
	}

	public addForeignKey(options: AddForeignKeyOptions): this {
		this.alterTableStatement(options.table);

		this.sql += 'ADD ';
		this.foreignKeyConstraint(options.table, options.fk);

		return this;
	}

	public alterColumnStatement(column: string): this {
		this.sql += 'ALTER COLUMN ' + column + ' ';

		return this;
	}

	public changeColumn(options: ChangeColumnOptions): this {
		this.alterTableStatement(options.table);
		this.alterColumnStatement(options.column);

		this.sql += this.createTableColumn(options.options);

		return this;
	}

	public dropColumn(options: DropColumnOptions): this {
		this.alterTableStatement(options.table);
		this.sql += 'DROP COLUMN ' + options.column;

		return this;
	}

	public dropForeignKey(options: DropForeignKeyOptions): this {
		this.alterTableStatement(options.table);
		this.sql += 'DROP ';
		this.foreignKeyStatement();
		this.sql += options.fk;

		return this;
	}

	public renameTable(options: RenameTableOptions): this {
		this.alterTableStatement(options.table);
		this.sql += 'RENAME ' + options.to;

		return this;
	}

	// ------------------------------------------------------------------------
	// Drop Database
	// ------------------------------------------------------------------------

	public dropDatabase(options: DropDatabaseOptions): this {
		this.sql += 'DROP DATABASE ';

		if (options.ifExists) {
			this.sql += 'IF EXISTS ';
		}

		this.sql += options.name;

		return this;
	}

	// ------------------------------------------------------------------------
	// Drop Table
	// ------------------------------------------------------------------------

	public dropTable(options: DropTableOptions): this {
		if (Array.isArray(options.tables)) {
			options.tables = options.tables.join(',');
		}

		this.sql += 'DROP TABLE ';

		if (options.ifExists) {
			this.sql += 'IF EXISTS ';
		}

		this.sql += options.tables;

		return this;
	}

	// ------------------------------------------------------------------------
	// Drop User
	// ------------------------------------------------------------------------

	public dropUser(options: DropUserOptions): this {
		if (Array.isArray(options.names)) {
			options.names = options.names.join(',');
		}

		this.sql += 'DROP USER ';

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
		this.sql += 'TRUNCATE TABLE ' + options.table;

		return this;
	}
}
