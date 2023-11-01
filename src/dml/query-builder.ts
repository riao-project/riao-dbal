import { InsertOptions } from './insert';
import { Where } from './where';
import { SelectColumn, SelectQuery } from './select';
import { UpdateOptions } from './update';
import { DeleteOptions } from './delete';
import { Builder } from '../builder';
import { OrderBy } from './order-by';
import { Join } from './join';
import {
	ConditionToken,
	ConditionTokenType,
} from '../conditions/condition-token';
import { columnName } from '../tokens';
import { DatabaseFunctionToken } from '../functions';
import { DatabaseRecord } from '../record';

export class DatabaseQueryBuilder extends Builder {
	// ------------------------------------------------------------------------
	// Select
	// ------------------------------------------------------------------------

	public selectColumn(column: SelectColumn): this {
		if (typeof column === 'string') {
			this.columnName(column);
		}
		else if (typeof column === 'object') {
			if ('column' in column) {
				this.columnName(column.column);
			}
			else if ('query' in column) {
				if (this.isDatabaseFunction(column.query)) {
					this.databaseFunction(<DatabaseFunctionToken>column.query);
				}
				else {
					this.openParens();
					this.select(<SelectQuery>column.query);
					this.closeParens();
					this.trimEnd(' ');
				}
			}

			if (column.as) {
				this.sql += ' AS ';
				this.columnName(column.as);
			}
		}

		return this;
	}

	public selectColumnList(columns?: SelectColumn[]): this {
		if (columns) {
			for (const column of columns) {
				this.selectColumn(column);
				this.sql += ', ';
			}

			this.trimEnd(', ');
			this.sql += ' ';
		}
		else {
			this.sql += '* ';
		}

		return this;
	}

	public selectFrom(from: string): this {
		this.sql += 'FROM ';
		this.tableName(from);
		this.sql += ' ';

		return this;
	}

	public selectStatement(): this {
		this.sql += 'SELECT ';

		return this;
	}

	public distinctStatement(): this {
		this.sql += 'DISTINCT ';

		return this;
	}

	public selectTop(limit: number): this {
		// This will be overridden in mssql for LIMIT func
		return this;
	}

	public equals(value: any) {
		this.sql += this.operators.equals + ' ';
		this.placeholder(value);
	}

	public like(value: any) {
		this.sql += this.operators.like + ' ';
		this.placeholder(value);
	}

	public lt(value: any) {
		this.sql += this.operators.lt + ' ';
		this.placeholder(value);
	}

	public lte(value: any) {
		this.sql += this.operators.lte + ' ';
		this.placeholder(value);
	}

	public gt(value: any) {
		this.sql += this.operators.gt + ' ';
		this.placeholder(value);
	}

	public gte(value: any) {
		this.sql += this.operators.gte + ' ';
		this.placeholder(value);
	}

	public notEqual(value: any) {
		this.sql += this.operators.notEqual + ' ';
		this.placeholder(value);
	}

	public and() {
		this.sql += this.operators.and + ' ';
	}

	public or() {
		this.sql += this.operators.or + ' ';
	}

	public isNull() {
		this.sql += this.operators.is + ' ' + this.operators.null + ' ';
	}

	public inArray(values: any[]) {
		this.sql += this.operators.in + ' ';

		this.openParens();

		for (const value of values) {
			this.placeholder(value);
			this.sql += ', ';
		}

		this.trimEnd(', ');

		this.closeParens();
	}

	public between(a: any, b: any) {
		this.sql += this.operators.between + ' ';

		this.openParens();

		this.placeholder(a);
		this.sql += ', ';

		this.placeholder(b);

		this.closeParens();
	}

	public not(value: any) {
		const isConditionToken = this.isConditionToken(value);
		const conditionType: ConditionTokenType = isConditionToken
			? value?.riao_condition
			: null;

		if (
			isConditionToken &&
			(conditionType === ConditionTokenType.LIKE ||
				conditionType === ConditionTokenType.IN_ARRAY)
		) {
			this.sql += 'NOT ';
			this.buildConditionToken(value);
		}
		else if (isConditionToken) {
			throw new Error('Cannot use not() with ' + conditionType);
		}
		else if (typeof value === 'object' || Array.isArray(value)) {
			this.sql += '!';
			this.whereClause(value);
		}
		else {
			this.notEqual(value);
		}
	}

	public isConditionToken(value: any): boolean {
		return typeof value === 'object' && 'riao_condition' in value;
	}

	public buildConditionToken(condition: ConditionToken): this {
		if (condition.riao_condition === ConditionTokenType.EQUALS) {
			this.equals(condition.value);
		}
		else if (condition.riao_condition === ConditionTokenType.LIKE) {
			this.like(condition.value);
		}
		else if (condition.riao_condition === ConditionTokenType.LT) {
			this.lt(condition.value);
		}
		else if (condition.riao_condition === ConditionTokenType.LTE) {
			this.lte(condition.value);
		}
		else if (condition.riao_condition === ConditionTokenType.GT) {
			this.gt(condition.value);
		}
		else if (condition.riao_condition === ConditionTokenType.GTE) {
			this.gte(condition.value);
		}
		else if (condition.riao_condition === ConditionTokenType.IN_ARRAY) {
			this.inArray(condition.value);
		}
		else if (condition.riao_condition === ConditionTokenType.BETWEEN) {
			this.between(condition.value.a, condition.value.b);
		}
		else if (condition.riao_condition === ConditionTokenType.NOT) {
			this.not(condition.value);
		}

		return this;
	}

	public whereClause(where: Where | Where[] | ConditionToken): this {
		if (Array.isArray(where)) {
			this.openParens();

			for (const w of where) {
				this.whereClause(w);
			}

			this.closeParens();
		}
		else if (this.isConditionToken(where)) {
			this.buildConditionToken(where as ConditionToken);
		}
		else if (typeof where === 'object') {
			this.openParens();

			for (const key in where) {
				const value = where[key];

				if (value === null) {
					this.columnName(key);
					this.sql += ' ';
					this.isNull();
				}
				else if (this.isConditionToken(value)) {
					this.columnName(key);
					this.sql += ' ';
					this.buildConditionToken(value);
				}
				else {
					this.columnName(key);
					this.sql += ' ';
					this.equals(value);
				}

				this.and();
			}

			this.trimEnd(this.operators.and);
			this.closeParens();
		}
		else if (where === 'and') {
			this.and();
		}
		else if (where === 'or') {
			this.or();
		}

		return this;
	}

	public where(where: Where | Where[]): this {
		if (typeof where === 'object' && !Object.keys(where).length) {
			return this;
		}

		this.sql += 'WHERE ';

		this.whereClause(where);

		return this;
	}

	public limit(nRecords: number): this {
		this.sql += 'LIMIT ' + nRecords + ' ';

		return this;
	}

	public orderBy(by: OrderBy) {
		this.sql += 'ORDER BY ';

		for (const key in by) {
			this.columnName(key);
			this.sql += ' ' + by[key] + ', ';
		}

		this.trimEnd(', ');
	}

	public select(query: SelectQuery): this {
		this.selectStatement();

		if (query.distinct) {
			this.distinctStatement();
		}

		if (query.limit) {
			this.selectTop(query.limit);
		}

		this.selectColumnList(query.columns);

		if (query.table) {
			this.selectFrom(query.table);
		}

		for (const join of query.join ?? []) {
			this.join(join);
		}

		if (query.where) {
			this.where(query.where);
		}

		if (query.limit) {
			this.limit(query.limit);
		}

		if (query.orderBy) {
			this.orderBy(query.orderBy);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Join
	// ------------------------------------------------------------------------

	public join(join: Join) {
		this.sql += (join.type ?? '') + ' JOIN ';
		this.tableName(join.table);
		this.sql += ' ';

		if (join.alias) {
			this.sql += 'AS ';
			this.tableName(join.alias);
			this.sql += ' ';
		}

		if (join.on) {
			this.sql += 'ON ';
			this.whereClause(join.on);
		}
	}

	// ------------------------------------------------------------------------
	// Insert
	// ------------------------------------------------------------------------

	public insertIntoStatement(table: string): this {
		this.sql += 'INSERT INTO ';
		this.tableName(table);
		this.sql += ' ';

		return this;
	}

	public insertColumnNames(record: Record<string, any>): this {
		this.openParens();
		this.commaSeparate(
			Object.keys(record).map((name) => this.getEnclosedName(name))
		);
		this.closeParens();

		return this;
	}

	public insertOnDuplicateKeyUpdate(assignment: Record<string, any>): this {
		this.sql += 'ON DUPLICATE KEY UPDATE ';
		this.updateKeyValues(assignment);

		return this;
	}

	public insertIfNotExists(): this {
		this.insertOnDuplicateKeyUpdate({ id: columnName('id') });

		return this;
	}

	public insertOutput(primaryKey: string): this {
		// This will be overridden in mssql to return the insert id(s)
		return this;
	}

	public insertReturning(primaryKey: string): this {
		// This will be overridden in postgres to return the insert id(s)
		return this;
	}

	public insert(options: InsertOptions): this {
		this.insertIntoStatement(options.table);
		if (!Array.isArray(options.records)) {
			options.records = [options.records];
		}

		const columns: Record<string, true> = {};
		const insertions = [];

		if (options.records.length) {
			for (const rec of options.records as DatabaseRecord[]) {
				for (const key in rec) {
					if (!(key in columns)) {
						columns[key] = true;
					}
				}
			}

			for (const rec of options.records as DatabaseRecord[]) {
				const insertion = {};

				for (const key in columns) {
					insertion[key] = rec[key] ?? null;
				}

				insertions.push(insertion);
			}

			this.insertColumnNames(columns);
		}

		if (options.primaryKey) {
			this.insertOutput(options.primaryKey);
		}

		this.sql += 'VALUES ';

		for (let i = 0; i < insertions.length; i++) {
			const record = insertions[i];
			this.openParens();

			for (const key in record) {
				this.placeholder(record[key]);
				this.sql = this.sql.trimEnd();
				this.sql += ', ';
			}

			this.trimEnd(', ');
			this.closeParens();

			this.sql = this.sql.trimEnd();
			this.sql += ', ';
		}

		this.trimEnd(', ');
		this.sql += ' ';

		if (options.ifNotExists) {
			this.insertIfNotExists();
		}
		else if (options.onDuplicateKeyUpdate) {
			this.insertOnDuplicateKeyUpdate(options.onDuplicateKeyUpdate);
		}

		this.trimEnd(' ');

		if (options.primaryKey) {
			this.insertReturning(options.primaryKey);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Update
	// ------------------------------------------------------------------------

	public updateStatement(table: string): this {
		this.sql += 'UPDATE ';
		this.tableName(table);
		this.sql += ' ';

		return this;
	}

	public updateKeyValues(values: { [key: string]: any }): this {
		const keys = Object.keys(values);

		for (const key of keys) {
			this.columnName(key);
			this.sql += ' = ';
			this.placeholder(values[key]);
			this.sql = this.sql.trimEnd();
			this.sql += ', ';
		}

		this.trimEnd(', ');
		this.sql += ' ';

		return this;
	}

	public updateSetStatement(values: { [key: string]: any }): this {
		this.sql += 'SET ';
		this.updateKeyValues(values);

		return this;
	}

	public update(options: UpdateOptions): this {
		this.updateStatement(options.table);

		for (const join of options.join ?? []) {
			this.join(join);
		}

		this.updateSetStatement(options.set);

		if (options.where) {
			this.where(options.where);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Delete
	// ------------------------------------------------------------------------

	public deleteStatement(table: string): this {
		this.sql += 'DELETE FROM ';
		this.tableName(table);
		this.sql += ' ';

		return this;
	}

	public delete(options: DeleteOptions): this {
		this.deleteStatement(options.table);

		for (const join of options.join ?? []) {
			this.join(join);
		}

		if (options.where) {
			this.where(options.where);
		}

		return this;
	}
}
