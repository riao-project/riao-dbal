import { InsertOptions } from './insert';
import { SelectColumn, SelectQuery } from './select';
import { UpdateOptions } from './update';
import { DeleteOptions } from './delete';
import { StatementBuilder } from '../builder/statement-builder';
import { GroupBy } from './group-by';
import { OrderBy } from './order-by';
import { Join } from './join';
import {
	ComparisonToken,
	ComparisonOperator,
	isComparisonToken,
} from '../comparison';
import { columnName } from '../tokens';
import { isDatabaseFunction } from '../functions';
import { DatabaseRecord } from '../record';
import {
	Expression,
	LogicalOperator,
	LogicalToken,
	MathOperation,
	MathToken,
	NotToken,
	isExpressionToken,
	isIdentifierToken,
	isLogicalToken,
	isMathToken,
} from '../expression';
import { ExpressionToken } from '../expression/expression-token';
import { IdentifierToken } from '../expression/identifier';
import {
	DatabaseFunction,
	DatabaseFunctionKeys,
} from '../functions/function-token';
import { Subquery } from './subquery';
import { KeyValExpression } from '../expression/key-val-expression';

export class DatabaseQueryBuilder extends StatementBuilder {
	// ------------------------------------------------------------------------
	// Expression
	// ------------------------------------------------------------------------

	public expression(expr: Expression | LogicalToken) {
		if (Array.isArray(expr)) {
			this.sql.openParens();

			for (const e of expr) {
				this.expression(e);
			}

			this.sql.closeParens();
		}
		else if (isExpressionToken(expr)) {
			const token = expr as ExpressionToken;

			if (isComparisonToken(token)) {
				this.buildComparisonToken(token as ComparisonToken);
			}
			else if (isLogicalToken(token)) {
				this.logical(token as LogicalToken);
			}
			else if (isIdentifierToken(token)) {
				this.sql.columnName((token as IdentifierToken).name);
			}
			else if (isDatabaseFunction(token)) {
				this.databaseFunction(token as any as DatabaseFunction);
			}
			else if (isMathToken(token)) {
				this.math(token as MathToken);
			}
		}
		else if (expr && typeof expr === 'object') {
			if (expr instanceof Buffer || expr instanceof Date) {
				this.sql.placeholder(expr);
			}
			else if (expr instanceof Subquery) {
				this.subquery(expr);
			}
			else {
				this.keyValueExpression(expr as KeyValExpression);
			}
		}
		else {
			this.sql.placeholder(expr);
		}
	}

	public subquery(subquery: Subquery) {
		this.sql.openParens();
		this.select(subquery.query);
		this.sql.closeParens();
		this.sql.trimEnd(' ');
	}

	public keyValueExpression(kv: KeyValExpression) {
		if (!Object.keys(kv).length) {
			return this;
		}

		this.sql.openParens();

		for (const key in kv) {
			const value = kv[key];

			this.sql.columnName(key);
			this.sql.space();

			if (value === null) {
				this.isNull();
			}
			else if (isExpressionToken(value)) {
				const token = value as ExpressionToken;

				if (isComparisonToken(token)) {
					this.expression(value);
				}
				else if (isLogicalToken(token)) {
					this.expression(value);
				}
				else if (isIdentifierToken(token)) {
					this.equal(value);
				}
				else if (isDatabaseFunction(token)) {
					this.equal(value);
				}
			}
			else {
				this.equal(value);
			}

			this.and();
		}

		this.sql.trimEnd(this.sql.operators.and);
		this.sql.closeParens();
	}

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
				this.expression(column.query);
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

	public tableAlias(alias: string): this {
		this.sql.append('AS ');
		this.sql.tableName(alias);
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
	// Comparisons
	// ------------------------------------------------------------------------

	public equal(value: Expression) {
		this.sql.append(this.sql.operators.equals + ' ');
		this.expression(value);
	}

	public like(value: Expression) {
		this.sql.append(this.sql.operators.like + ' ');
		this.expression(value);
	}

	public lt(value: Expression) {
		this.sql.append(this.sql.operators.lt + ' ');
		this.expression(value);
	}

	public lte(value: Expression) {
		this.sql.append(this.sql.operators.lte + ' ');
		this.expression(value);
	}

	public gt(value: Expression) {
		this.sql.append(this.sql.operators.gt + ' ');
		this.expression(value);
	}

	public gte(value: Expression) {
		this.sql.append(this.sql.operators.gte + ' ');
		this.expression(value);
	}

	public notEqual(value: Expression) {
		this.sql.append(this.sql.operators.notEqual + ' ');
		this.expression(value);
	}

	public isNull() {
		this.sql.append(
			this.sql.operators.is + ' ' + this.sql.operators.null + ' '
		);
	}

	public inArray(values: Expression[]) {
		this.sql.append(this.sql.operators.in + ' ');

		this.sql.openParens();

		for (const value of values) {
			this.expression(value);
			this.sql.append(', ');
		}

		this.sql.trimEnd(', ');

		this.sql.closeParens();
	}

	public between(a: Expression, b: Expression) {
		this.sql.append(this.sql.operators.between + ' ');

		this.expression(a);
		this.sql.append('AND ');

		this.expression(b);
	}

	public notNull() {
		this.sql.append('NOT NULL ');
	}

	public buildComparisonToken(condition: ComparisonToken): this {
		if (condition.op === ComparisonOperator.EQUALS) {
			this.equal(condition.value);
		}
		else if (condition.op === ComparisonOperator.NOT_EQUAL) {
			this.notEqual(condition.value);
		}
		else if (condition.op === ComparisonOperator.LIKE) {
			this.like(condition.value);
		}
		else if (condition.op === ComparisonOperator.LT) {
			this.lt(condition.value);
		}
		else if (condition.op === ComparisonOperator.LTE) {
			this.lte(condition.value);
		}
		else if (condition.op === ComparisonOperator.GT) {
			this.gt(condition.value);
		}
		else if (condition.op === ComparisonOperator.GTE) {
			this.gte(condition.value);
		}
		else if (condition.op === ComparisonOperator.IN_ARRAY) {
			this.inArray(condition.value);
		}
		else if (condition.op === ComparisonOperator.BETWEEN) {
			this.between(condition.value.a, condition.value.b);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Logical
	// ------------------------------------------------------------------------

	public and() {
		this.sql.append(this.sql.operators.and + ' ');
	}

	public or() {
		this.sql.append(this.sql.operators.or + ' ');
	}

	public not(value: Expression) {
		if (value === null) {
			this.sql.append(this.sql.operators.is + ' ');
			this.notNull();

			return;
		}

		const isComparison =
			isExpressionToken(value) &&
			isComparisonToken(value as ExpressionToken);

		const conditionType: ComparisonOperator = isComparison
			? (value as ComparisonToken)?.op
			: null;

		if (
			isComparison &&
			(conditionType === ComparisonOperator.LIKE ||
				conditionType === ComparisonOperator.IN_ARRAY)
		) {
			this.sql.append('NOT ');
			this.buildComparisonToken(value as ComparisonToken);
		}
		else if (isComparison) {
			throw new Error('Cannot use not() with ' + conditionType);
		}
		else if (typeof value === 'object' || Array.isArray(value)) {
			this.sql.append('!');
			this.expression(value);
		}
		else {
			this.notEqual(value);
		}
	}

	public logical(token: LogicalToken) {
		if (token.op === LogicalOperator.AND) {
			this.and();
		}
		else if (token.op === LogicalOperator.OR) {
			this.or();
		}
		else if (token.op === LogicalOperator.NOT) {
			this.not((token as NotToken).expr);
		}
	}

	// ------------------------------------------------------------------------
	// Math
	// ------------------------------------------------------------------------

	public addition() {
		this.sql.append(this.sql.operators.addition + ' ');
	}

	public subtraction() {
		this.sql.append(this.sql.operators.subtraction + ' ');
	}

	public multiplication() {
		this.sql.append(this.sql.operators.multiplication + ' ');
	}

	public division() {
		this.sql.append(this.sql.operators.division + ' ');
	}

	public modulo() {
		this.sql.append(this.sql.operators.modulo + ' ');
	}

	public math(token: MathToken) {
		if (token.op === MathOperation.ADD) {
			this.addition();
		}
		if (token.op === MathOperation.SUB) {
			this.subtraction();
		}
		if (token.op === MathOperation.MUL) {
			this.multiplication();
		}
		if (token.op === MathOperation.DIV) {
			this.division();
		}
		if (token.op === MathOperation.MOD) {
			this.modulo();
		}
	}

	// ------------------------------------------------------------------------
	// Where
	// ------------------------------------------------------------------------

	public where(where: Expression): this {
		this.sql.append('WHERE ');
		this.expression(where);

		return this;
	}

	public limit(nRecords: number): this {
		this.sql.append('LIMIT ' + nRecords + ' ');

		return this;
	}

	public groupBy(by: GroupBy): this {
		this.sql.append('GROUP BY ');

		for (const key of by) {
			this.sql.columnName(key);
			this.sql.append(', ');
		}

		this.sql.trimEnd(', ');
		this.sql.space();

		return this;
	}

	public orderBy(by: OrderBy) {
		this.sql.append('ORDER BY ');

		for (const key in by) {
			this.sql.columnName(key);
			this.sql.append(' ' + by[key] + ', ');
		}

		this.sql.trimEnd(', ');
		this.sql.space();
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

		if (query.tableAlias) {
			this.tableAlias(query.tableAlias);
		}

		for (const join of query.join ?? []) {
			this.join(join);
		}

		if (query.where) {
			this.where(query.where);
		}

		if (query.groupBy?.length) {
			this.groupBy(query.groupBy);
		}

		if (query.orderBy) {
			this.orderBy(query.orderBy);
		}

		if (query.limit) {
			this.limit(query.limit);
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
			this.tableAlias(join.alias);
		}

		if (join.on) {
			this.sql.append('ON ');
			this.expression(join.on);
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

	public insertColumnNames(record: Record<string, Expression>): this {
		this.sql.openParens();
		this.sql.commaSeparate(
			Object.keys(record).map((name) => this.sql.getEnclosedName(name))
		);
		this.sql.closeParens();

		return this;
	}

	public insertOnDuplicateKeyUpdate(
		assignment: Record<string, Expression>
	): this {
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
				this.expression(record[key]);
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

	public updateKeyValues(values: { [key: string]: Expression }): this {
		const keys = Object.keys(values);

		for (const key of keys) {
			this.sql.columnName(key);
			this.sql.append(' = ');
			this.expression(values[key]);
			this.sql = this.sql.trimEnd();
			this.sql.append(', ');
		}

		this.sql.trimEnd(', ');
		this.sql.space();

		return this;
	}

	public updateSetStatement(values: { [key: string]: Expression }): this {
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

	// ------------------------------------------------------------------------
	// Database Functions
	// ------------------------------------------------------------------------

	/**
	 * Append a database function the query
	 *
	 * @param fn Database function token
	 */
	public databaseFunction(fn: DatabaseFunction): this {
		switch (fn.fn) {
		case DatabaseFunctionKeys.AVERAGE:
			this.average(fn);
			break;

		case DatabaseFunctionKeys.COUNT:
			this.count(fn);
			break;

		case DatabaseFunctionKeys.MIN:
			this.min(fn);
			break;

		case DatabaseFunctionKeys.MAX:
			this.max(fn);
			break;

		case DatabaseFunctionKeys.SUM:
			this.sum(fn);
			break;

		case DatabaseFunctionKeys.CURRENT_TIMESTAMP:
			this.currentTimestamp(fn);
			break;
		}

		return this;
	}

	public average(fn: DatabaseFunction): this {
		this.sql.append('AVG');
		this.sql.openParens();

		if (fn.params.options.distinct) {
			this.distinctStatement();
		}

		this.expression(fn.params.expr);

		this.sql.closeParens();

		return this;
	}

	public count(fn: DatabaseFunction): this {
		this.sql.append('COUNT(*)');

		return this;
	}

	public min(fn: DatabaseFunction): this {
		this.sql.append('MIN');
		this.sql.openParens();

		this.expression(fn.params);

		this.sql.closeParens();

		return this;
	}

	public max(fn: DatabaseFunction): this {
		this.sql.append('MAX');
		this.sql.openParens();

		this.expression(fn.params);

		this.sql.closeParens();

		return this;
	}

	public sum(fn: DatabaseFunction): this {
		this.sql.append('SUM');
		this.sql.openParens();

		if (fn.params.options.distinct) {
			this.distinctStatement();
		}

		this.expression(fn.params.expr);

		this.sql.closeParens();

		return this;
	}

	public currentTimestamp(fn: DatabaseFunction): this {
		this.sql.append('CURRENT_TIMESTAMP');

		return this;
	}
}
