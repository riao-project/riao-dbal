import { StatementBuilder } from '../builder/statement-builder';
import { BaseIntColumnOptions, ColumnOptions, ColumnType } from '../column';
import {
	AddColumnsOptions,
	AddForeignKeyOptions,
	ChangeColumnOptions,
	DropColumnOptions,
	DropForeignKeyOptions,
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
import { DatabaseQueryBuilder } from '../dml';
import { Expression, isExpressionToken } from '../expression';
import { DatabaseFunctionToken, isDatabaseFunction } from '../functions';
import { DatabaseFunctionKeys } from '../functions/function-token';

export class DataDefinitionBuilder extends StatementBuilder {
	protected columnTypes = ColumnType;
	protected queryBuilderType = DatabaseQueryBuilder;

	public getQueryBuilder(): DatabaseQueryBuilder {
		return new this.queryBuilderType();
	}

	public getColumnTypes(): typeof ColumnType {
		return <any>this.columnTypes;
	}

	// ------------------------------------------------------------------------
	// Create Database
	// ------------------------------------------------------------------------

	public createDatabaseStatement(): this {
		this.sql.append('CREATE DATABASE ');

		return this;
	}

	public createDatabase(options: CreateDatabaseOptions): this {
		this.createDatabaseStatement();
		this.sql.append(options.name);

		return this;
	}

	// ------------------------------------------------------------------------
	// Create User
	// ------------------------------------------------------------------------

	public createUserStatement(): this {
		this.sql.append('CREATE USER ');

		return this;
	}

	public createUserPassword(password: string): this {
		this.sql.append(`WITH PASSWORD '${password}' `);

		return this;
	}

	public createUser(options: CreateUserOptions): this {
		this.createUserStatement();
		this.sql.append(options.name + ' ');

		if (options.password) {
			this.createUserPassword(options.password);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Create Table
	// ------------------------------------------------------------------------

	public createTableStatement(): this {
		this.sql.append('CREATE TABLE ');

		return this;
	}

	public ifNotExists(): this {
		this.sql.append('IF NOT EXISTS ');

		return this;
	}

	public createColumnType(column: ColumnOptions): this {
		this.sql.append(this.columnTypes[column.type]);

		if ('length' in column) {
			this.sql.append(`(${column.length})`);
		}

		if ('significant' in column && 'decimal' in column) {
			const significant = column.significant + column.decimal;
			const decimal = column.decimal;

			this.sql.append(`(${significant}, ${decimal})`);
		}

		this.sql.space();

		return this;
	}

	public columnRequired(): this {
		this.sql.append('NOT NULL ');

		return this;
	}

	public columnDefaultValue(column: ColumnOptions): this {
		this.sql.append('DEFAULT ');

		if (column.default === null) {
			this.columnDefaultNull();
		}
		else if (column.default === true) {
			this.columnDefaultTrue();
		}
		else if (column.default === false) {
			this.columnDefaultFalse();
		}
		else if (isExpressionToken(column.default)) {
			// CURRENT_TIMESTAMP does not work when wrapped in parenthesis for
			//	default value; but all other expressions should be wrapped
			let wrapParens = true;

			if (
				isDatabaseFunction(<any>column.default) &&
				(column.default as DatabaseFunctionToken).fn ===
					DatabaseFunctionKeys.CURRENT_TIMESTAMP
			) {
				wrapParens = false;
			}
			else {
				this.sql.openParens();
			}

			const dml = this.getQueryBuilder();
			dml.expression(<Expression>column.default);

			this.appendBuilder(dml);

			if (wrapParens) {
				this.sql.closeParens();
			}

			this.sql.append(' ');
		}
		else {
			this.sql.append(column.default + ' ');
		}

		return this;
	}

	public columnDefaultNull(): this {
		this.sql.append('NULL ');

		return this;
	}

	public columnDefaultTrue(): this {
		this.sql.append('TRUE ');

		return this;
	}

	public columnDefaultFalse(): this {
		this.sql.append('FALSE ');

		return this;
	}

	public columnAutoIncrement(): this {
		this.sql.append('AUTO_INCREMENT ');

		return this;
	}

	public createTableColumn(column: ColumnOptions): this {
		this.sql.columnName(column.name);
		this.sql.space();
		this.createColumnType(column);

		if (column.required) {
			this.columnRequired();
		}

		if (column.default !== undefined) {
			this.columnDefaultValue(column);
		}

		if ((column as BaseIntColumnOptions).autoIncrement) {
			this.columnAutoIncrement();
		}

		this.sql.trimEnd(' ');

		return this;
	}

	public createTablePrimaryKeys(names: string[]): this {
		this.sql.append(', PRIMARY KEY (');
		this.sql.append(
			names.map((key) => this.sql.getEnclosedName(key)).join(',')
		);
		this.sql.append(')');

		return this;
	}

	public createTableColumns(options: CreateTableOptions): this {
		this.sql.append('(');

		for (const column of options.columns) {
			this.createTableColumn(column);
			this.sql.append(', ');
		}

		this.sql.trimEnd(', ');

		const primaryKeys: string[] = options.columns
			.filter((column) => column.primaryKey)
			.map((column) => column.name);

		if (primaryKeys.length > 0) {
			this.createTablePrimaryKeys(primaryKeys);
		}

		for (const uniqueColumn of options.columns.filter(
			(column) => column.isUnique
		)) {
			this.sql.append(', ');
			this.uniqueConstraint(options.name, uniqueColumn.name);
		}

		for (const fk of options.foreignKeys ?? []) {
			this.sql.append(', ');
			this.foreignKeyConstraint(options.name, fk);
		}

		this.sql.trimEnd(' ');

		this.sql.append(')');

		return this;
	}

	public createTable(options: CreateTableOptions): this {
		this.createTableStatement();

		if (options.ifNotExists) {
			this.ifNotExists();
		}

		this.sql.tableName(options.name);
		this.sql.space();

		this.createTableColumns(options);

		return this;
	}

	public constraintStatement(): this {
		this.sql.append('CONSTRAINT ');

		return this;
	}

	// ------------------------------------------------------------------------
	// Grant permissions
	// ------------------------------------------------------------------------

	public grantOnDatabase(database: string): this {
		this.sql.append(database + '.*');

		return this;
	}

	public grantOn(on: GrantOn): this {
		if (on === '*') {
			this.sql.append('*.*');
		}
		else if ('database' in on && 'table' in on) {
			this.sql.append(on.database + '.' + on.table);
		}
		else if ('database' in on) {
			this.grantOnDatabase(on.database);
		}

		this.sql.space();

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

		this.sql.append('GRANT ');
		this.sql.append(options.privileges.join(', ') + ' ');
		this.sql.append('ON ');
		this.grantOn(options.on);

		this.sql.append('TO ' + options.to.join(', ') + ' ');

		return this;
	}

	// ------------------------------------------------------------------------
	// Foreign Key Constraint
	// ------------------------------------------------------------------------

	public foreignKeyStatement(): this {
		this.sql.append('FOREIGN KEY ');

		return this;
	}

	public foreignKeyName(childTable: string, fk: ForeignKeyConstraint): this {
		this.sql.append(fk.name ?? `fk_${childTable}_${fk.columns.join('_')}`);
		this.sql.space();

		return this;
	}

	public foreignKeyColumns(columns: string[]): this {
		this.sql.openParens();
		this.sql.commaSeparate(
			columns.map((column) => this.sql.getEnclosedName(column))
		);
		this.sql.closeParens();

		return this;
	}

	public referencesStatement(table: string, columns: string[]): this {
		this.sql.append('REFERENCES ');
		this.sql.tableName(table);

		this.sql.openParens();
		this.sql.commaSeparate(
			columns.map((column) => this.sql.getEnclosedName(column))
		);
		this.sql.closeParens();

		return this;
	}

	public fkOnUpdate(option: ForeignKeyReferenceOption): this {
		this.sql.append('ON UPDATE ' + option + ' ');

		return this;
	}

	public fkOnDelete(option: ForeignKeyReferenceOption): this {
		this.sql.append('ON DELETE ' + option + ' ');

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

	public disableForeignKeyChecks(): this {
		this.sql.append('SET FOREIGN_KEY_CHECKS=0');

		return this;
	}

	public enableForeignKeyChecks(): this {
		this.sql.append('SET FOREIGN_KEY_CHECKS=1');

		return this;
	}

	public uniqueConstraint(table: string, column: string): this {
		this.sql.append(`CONSTRAINT uq_${table}_${column} `);
		this.sql.append('UNIQUE(' + this.sql.getEnclosedName(column) + ')');

		return this;
	}

	// ------------------------------------------------------------------------
	// Alter Table
	// ------------------------------------------------------------------------

	public alterTableStatement(table: string): this {
		this.sql.append('ALTER TABLE ');
		this.sql.tableName(table);
		this.sql.space();

		return this;
	}

	public addColumns(options: AddColumnsOptions): this {
		this.alterTableStatement(options.table);

		this.sql.append('ADD ');

		for (const column of options.columns) {
			this.createTableColumn(column);
			this.sql.append(', ');
		}

		this.sql.trimEnd(', ');

		return this;
	}

	public addForeignKey(options: AddForeignKeyOptions): this {
		this.alterTableStatement(options.table);

		this.sql.append('ADD ');
		this.foreignKeyConstraint(options.table, options);

		return this;
	}

	public alterColumnStatement(column: string): this {
		this.sql.append('ALTER COLUMN ');
		this.sql.columnName(column);
		this.sql.space();

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
		this.sql.append('DROP COLUMN ');
		this.sql.columnName(options.column);

		return this;
	}

	public dropForeignKey(options: DropForeignKeyOptions): this {
		this.alterTableStatement(options.table);
		this.sql.append('DROP ');
		this.foreignKeyStatement();
		this.sql.append(options.fk);

		return this;
	}

	public renameTable(options: RenameTableOptions): this {
		this.alterTableStatement(options.table);
		this.sql.append('RENAME ');
		this.sql.tableName(options.to);

		return this;
	}

	// ------------------------------------------------------------------------
	// Drop Database
	// ------------------------------------------------------------------------

	public dropDatabase(options: DropDatabaseOptions): this {
		this.sql.append('DROP DATABASE ');

		if (options.ifExists) {
			this.sql.append('IF EXISTS ');
		}

		this.sql.append(options.name);

		return this;
	}

	// ------------------------------------------------------------------------
	// Drop Table
	// ------------------------------------------------------------------------

	public dropTable(options: DropTableOptions): this {
		if (Array.isArray(options.tables)) {
			options.tables = options.tables.join(',');
		}

		this.sql.append('DROP TABLE ');

		if (options.ifExists) {
			this.sql.append('IF EXISTS ');
		}

		this.sql.append(
			options.tables
				.split(',')
				.map((table) => this.sql.getEnclosedName(table))
				.join(',')
		);

		return this;
	}

	// ------------------------------------------------------------------------
	// Drop User
	// ------------------------------------------------------------------------

	public dropUser(options: DropUserOptions): this {
		if (Array.isArray(options.names)) {
			options.names = options.names.join(',');
		}

		this.sql.append('DROP USER ');

		if (options.ifExists) {
			this.sql.append('IF EXISTS ');
		}

		this.sql.append(options.names);

		return this;
	}

	// ------------------------------------------------------------------------
	// Truncate Table
	// ------------------------------------------------------------------------

	public truncate(options: TruncateOptions): this {
		this.sql.append('TRUNCATE TABLE ');
		this.sql.tableName(options.table);

		return this;
	}
}
