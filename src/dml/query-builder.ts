import { InsertOptions } from './insert';
import { Where } from './where';
import { SelectColumn, SelectQuery } from './select';
import { UpdateOptions } from './update';
import { DeleteOptions } from './delete';
import { StatementBuilder } from '../builder/statement-builder';
import { OrderBy } from './order-by';
import { Join } from './join';
import {
	ConditionToken,
	ConditionTokenType,
} from '../conditions/condition-token';
import { isCondition } from '../conditions';
import { columnName } from '../tokens';
import { DatabaseFunctionToken, isDatabaseFunction } from '../functions';
import { DatabaseRecord } from '../record';

export class DatabaseQueryBuilder extends StatementBuilder {
	// ------------------------------------------------------------------------
	// Select
	// ------------------------------------------------------------------------

	public selectColumn(column: SelectColumn): this {
		if (typeof column === 'string') {
			this.sql.columnName(column);
		}
		else if (typeof column === 'object') {
			if ('column' in column) {
				this.sql.columnName(column.column);
			}
			else if ('query' in column) {
				if (isDatabaseFunction(column.query)) {
					this.sql.databaseFunction(
						<DatabaseFunctionToken>column.query
					);
				}
				else {
					this.sql.openParens();
					this.select(<SelectQuery>column.query);
					this.sql.closeParens();
					this.sql.trimEnd(' ');
				}
			}

			if (column.as) {
				this.sql.append(' AS ');
				this.sql.columnName(column.as);
			}
		}

		return this;
	}

	public selectColumnList(columns?: SelectColumn[]): this {
		if (columns) {
			for (const column of columns) {
				this.selectColumn(column);
				this.sql.append(', ');
			}

			this.sql.trimEnd(', ');
			this.sql.space();
		}
		else {
			this.sql.append('* ');
		}

		return this;
	}

	public selectFrom(from: string): this {
		this.sql.append('FROM ');
		this.sql.tableName(from);
		this.sql.space();

		return this;
	}

	public selectStatement(): this {
		this.sql.append('SELECT ');

		return this;
	}

	public distinctStatement(): this {
		this.sql.append('DISTINCT ');

		return this;
	}

	public selectTop(limit: number): this {
		// This will be overridden in mssql for LIMIT func
		return this;
	}

	// ------------------------------------------------------------------------
	// Conditions
	// ------------------------------------------------------------------------

	public equals(value: any) {
		this.sql.append(this.sql.operators.equals + ' ');
		this.sql.placeholder(value);
	}

	public like(value: any) {
		this.sql.append(this.sql.operators.like + ' ');
		this.sql.placeholder(value);
	}

	public lt(value: any) {
		this.sql.append(this.sql.operators.lt + ' ');
		this.sql.placeholder(value);
	}

	public lte(value: any) {
		this.sql.append(this.sql.operators.lte + ' ');
		this.sql.placeholder(value);
	}

	public gt(value: any) {
		this.sql.append(this.sql.operators.gt + ' ');
		this.sql.placeholder(value);
	}

	public gte(value: any) {
		this.sql.append(this.sql.operators.gte + ' ');
		this.sql.placeholder(value);
	}

	public notEqual(value: any) {
		this.sql.append(this.sql.operators.notEqual + ' ');
		this.sql.placeholder(value);
	}

	public and() {
		this.sql.append(this.sql.operators.and + ' ');
	}

	public or() {
		this.sql.append(this.sql.operators.or + ' ');
	}

	public isNull() {
		this.sql.append(
			this.sql.operators.is + ' ' + this.sql.operators.null + ' '
		);
	}

	public inArray(values: any[]) {
		this.sql.append(this.sql.operators.in + ' ');

		this.sql.openParens();

		for (const value of values) {
			this.sql.placeholder(value);
			this.sql.append(', ');
		}

		this.sql.trimEnd(', ');

		this.sql.closeParens();
	}

	public between(a: any, b: any) {
		this.sql.append(this.sql.operators.between + ' ');

		this.sql.openParens();

		this.sql.placeholder(a);
		this.sql.append(', ');

		this.sql.placeholder(b);

		this.sql.closeParens();
	}

	public not(value: any) {
		const isConditionToken = isCondition(value);
		const conditionType: ConditionTokenType = isConditionToken
			? value?.riao_condition
			: null;

		if (
			isConditionToken &&
			(conditionType === ConditionTokenType.LIKE ||
				conditionType === ConditionTokenType.IN_ARRAY)
		) {
			this.sql.append('NOT ');
			this.buildConditionToken(value);
		}
		else if (isConditionToken) {
			throw new Error('Cannot use not() with ' + conditionType);
		}
		else if (typeof value === 'object' || Array.isArray(value)) {
			this.sql.append('!');
			this.whereClause(value);
		}
		else {
			this.notEqual(value);
		}
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
			this.sql.openParens();

			for (const w of where) {
				this.whereClause(w);
			}

			this.sql.closeParens();
		}
		else if (isCondition(where)) {
			this.buildConditionToken(where as ConditionToken);
		}
		else if (typeof where === 'object') {
			this.sql.openParens();

			for (const key in where) {
				const value = where[key];

				if (value === null) {
					this.sql.columnName(key);
					this.sql.space();
					this.isNull();
				}
				else if (isCondition(value)) {
					this.sql.columnName(key);
					this.sql.space();
					this.buildConditionToken(value);
				}
				else {
					this.sql.columnName(key);
					this.sql.space();
					this.equals(value);
				}

				this.and();
			}

			this.sql.trimEnd(this.sql.operators.and);
			this.sql.closeParens();
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

		this.sql.append('WHERE ');

		this.whereClause(where);

		return this;
	}

	public limit(nRecords: number): this {
		this.sql.append('LIMIT ' + nRecords + ' ');

		return this;
	}

	public orderBy(by: OrderBy) {
		this.sql.append('ORDER BY ');

		for (const key in by) {
			this.sql.columnName(key);
			this.sql.append(' ' + by[key] + ', ');
		}

		this.sql.trimEnd(', ');
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
		this.sql.append((join.type ?? '') + ' JOIN ');
		this.sql.tableName(join.table);
		this.sql.space();

		if (join.alias) {
			this.sql.append('AS ');
			this.sql.tableName(join.alias);
			this.sql.space();
		}

		if (join.on) {
			this.sql.append('ON ');
			this.whereClause(join.on);
		}
	}

	// ------------------------------------------------------------------------
	// Insert
	// ------------------------------------------------------------------------

	public insertIntoStatement(table: string): this {
		this.sql.append('INSERT INTO ');
		this.sql.tableName(table);
		this.sql.space();

		return this;
	}

	public insertColumnNames(record: Record<string, any>): this {
		this.sql.openParens();
		this.sql.commaSeparate(
			Object.keys(record).map((name) => this.sql.getEnclosedName(name))
		);
		this.sql.closeParens();

		return this;
	}

	public insertOnDuplicateKeyUpdate(assignment: Record<string, any>): this {
		this.sql.append('ON DUPLICATE KEY UPDATE ');
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

		this.sql.append('VALUES ');

		for (let i = 0; i < insertions.length; i++) {
			const record = insertions[i];
			this.sql.openParens();

			for (const key in record) {
				this.sql.placeholder(record[key]);
				this.sql = this.sql.trimEnd();
				this.sql.append(', ');
			}

			this.sql.trimEnd(', ');
			this.sql.closeParens();

			this.sql = this.sql.trimEnd();
			this.sql.append(', ');
		}

		this.sql.trimEnd(', ');
		this.sql.space();

		if (options.ifNotExists) {
			this.insertIfNotExists();
		}
		else if (options.onDuplicateKeyUpdate) {
			this.insertOnDuplicateKeyUpdate(options.onDuplicateKeyUpdate);
		}

		this.sql.trimEnd(' ');

		if (options.primaryKey) {
			this.insertReturning(options.primaryKey);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Update
	// ------------------------------------------------------------------------

	public updateStatement(table: string): this {
		this.sql.append('UPDATE ');
		this.sql.tableName(table);
		this.sql.space();

		return this;
	}

	public updateKeyValues(values: { [key: string]: any }): this {
		const keys = Object.keys(values);

		for (const key of keys) {
			this.sql.columnName(key);
			this.sql.append(' = ');
			this.sql.placeholder(values[key]);
			this.sql = this.sql.trimEnd();
			this.sql.append(', ');
		}

		this.sql.trimEnd(', ');
		this.sql.space();

		return this;
	}

	public updateSetStatement(values: { [key: string]: any }): this {
		this.sql.append('SET ');
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
		this.sql.append('DELETE FROM ');
		this.sql.tableName(table);
		this.sql.space();

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
