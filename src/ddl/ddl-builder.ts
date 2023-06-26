import { DatabaseFunctionToken } from '../functions/function-interface';
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

	public createColumnType(column: ColumnOptions): this {
		this.sql += this.columnTypes[column.type];

		if ('length' in column) {
			this.sql += `(${column.length})`;
		}

		if ('significant' in column && 'decimal' in column) {
			const significant = column.significant + column.decimal;
			const decimal = column.decimal;

			this.sql += `(${significant}, ${decimal})`;
		}

		this.sql += ' ';

		return this;
	}

	public columnRequired(): this {
		this.sql += 'NOT NULL ';

		return this;
	}

	public columnDefaultValue(column: ColumnOptions): this {
		this.sql += 'DEFAULT ';

		if (column.default === null) {
			this.columnDefaultNull();
		}
		else if (column.default === true) {
			this.columnDefaultTrue();
		}
		else if (column.default === false) {
			this.columnDefaultFalse();
		}
		else if (this.isDatabaseFunction(column.default)) {
			this.databaseFunction(<DatabaseFunctionToken>column.default);
		}
		else {
			this.sql += column.default + ' ';
		}

		return this;
	}

	public columnDefaultNull(): this {
		this.sql += 'NULL ';

		return this;
	}

	public columnDefaultTrue(): this {
		this.sql += 'TRUE ';

		return this;
	}

	public columnDefaultFalse(): this {
		this.sql += 'FALSE ';

		return this;
	}

	public columnAutoIncrement(): this {
		this.sql += 'AUTO_INCREMENT ';

		return this;
	}

	public createTableColumn(column: ColumnOptions): this {
		this.sql += column.name + ' ';
		this.createColumnType(column);

		if (column.default !== undefined) {
			this.columnDefaultValue(column);
		}

		if ((column as BaseIntColumnOptions).autoIncrement) {
			this.columnAutoIncrement();
		}

		if (column.required) {
			this.columnRequired();
		}

		this.trimEnd(' ');

		return this;
	}

	public createTableColumns(options: CreateTableOptions): this {
		this.sql += '(';

		for (const column of options.columns) {
			this.createTableColumn(column);
			this.sql += ', ';
		}

		this.trimEnd(', ');

		const primaryKeys: string[] = options.columns
			.filter((column) => column.primaryKey)
			.map((column) => column.name);

		if (primaryKeys.length > 0) {
			this.sql += ', PRIMARY KEY (' + primaryKeys.join(',') + ')';
		}

		for (const uniqueColumn of options.columns.filter(
			(column) => column.isUnique
		)) {
			this.sql += ', ';
			this.uniqueConstraint(options.name, uniqueColumn.name);
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
	// Constraints
	// ------------------------------------------------------------------------

	public uniqueConstraint(table: string, column: string): this {
		this.sql += `CONSTRAINT uq_${table}_${column} `;
		this.sql += 'UNIQUE(' + column + ')';

		return this;
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

		for (const column of options.columns) {
			this.createTableColumn(column);
			this.sql += ', ';
		}

		this.trimEnd(', ');

		return this;
	}

	public addForeignKey(options: AddForeignKeyOptions): this {
		this.alterTableStatement(options.table);

		this.sql += 'ADD ';
		this.foreignKeyConstraint(options.table, options);

		return this;
	}

	public alterColumnStatement(column: string): this {
		this.sql += 'ALTER COLUMN ' + column + ' ';

		return this;
	}

	public changeColumn(options: ChangeColumnOptions): this {
		this.alterTableStatement(options.table);
		this.alterColumnStatement(options.column);

		this.createTableColumn(options.options);

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
