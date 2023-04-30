import { InsertOptions } from './insert';
import { Where, WhereCondition, columnName } from './where';
import { SelectColumn, SelectQuery } from './select';
import { UpdateOptions } from './update';
import { DeleteOptions } from './delete';
import { Builder } from '../builder';
import { OrderBy } from './order-by';
import { Join } from './join';

export class DatabaseQueryBuilder extends Builder {
	// ------------------------------------------------------------------------
	// Select
	// ------------------------------------------------------------------------

	public selectColumnList(columns?: SelectColumn[]): this {
		this.sql += columns ? columns.join(', ') + ' ' : '* ';

		return this;
	}

	public selectFrom(from: string): this {
		this.sql += 'FROM ' + from + ' ';

		return this;
	}

	public selectStatement(): this {
		this.sql += 'SELECT ';

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

	public in(values: any[]) {
		this.sql += this.operators.in + ' ';

		this.openParens();

		for (const value of values) {
			this.placeholder(value);
			this.sql += ', ';
		}

		this.trimEnd(', ');

		this.closeParens();
	}

	public isRiaoCondition(value: any): boolean {
		return typeof value === 'object' && value.riao_condition;
	}

	public riaoCondition(condition: WhereCondition): this {
		if (condition.riao_condition === 'equals') {
			this.equals(condition.value);
		}
		else if (condition.riao_condition === 'like') {
			this.like(condition.value);
		}
		else if (condition.riao_condition === 'lt') {
			this.lt(condition.value);
		}
		else if (condition.riao_condition === 'lte') {
			this.lte(condition.value);
		}
		else if (condition.riao_condition === 'gt') {
			this.gt(condition.value);
		}
		else if (condition.riao_condition === 'gte') {
			this.gte(condition.value);
		}
		else if (condition.riao_condition === 'in') {
			this.in(condition.value);
		}
		else if (condition.riao_condition === 'not') {
			if (this.isRiaoCondition(condition.value)) {
				this.sql += 'NOT ';
				this.riaoCondition(condition.value);
			}
			else if (
				typeof condition.value === 'object' ||
				Array.isArray(condition.value)
			) {
				this.sql += '!';
				this.whereClause(condition.value);
			}
			else {
				this.notEqual(condition.value);
			}
		}

		return this;
	}

	public whereClause(where: Where | Where[] | WhereCondition): this {
		if (Array.isArray(where)) {
			this.openParens();

			for (const w of where) {
				this.whereClause(w);
			}

			this.closeParens();
		}
		else if (this.isRiaoCondition(where)) {
			this.riaoCondition(where as WhereCondition);
		}
		else if (typeof where === 'object') {
			this.openParens();

			for (const key in where) {
				const value = where[key];

				if (value === null) {
					this.sql += key + ' ';
					this.isNull();
				}
				else if (this.isRiaoCondition(value)) {
					this.sql += key + ' ';
					this.riaoCondition(value);
				}
				else {
					this.sql += key + ' ';
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
			this.sql += key + ' ' + by[key] + ', ';
		}

		this.trimEnd(', ');
	}

	public select(query: SelectQuery): this {
		this.selectStatement();
		this.selectColumnList(query.columns);
		this.selectFrom(query.table);

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
		this.sql += join.type + ' JOIN ';
		this.sql += join.table + ' ';

		if (join.alias) {
			this.sql += 'AS ' + join.alias + ' ';
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
		this.sql += `INSERT INTO ${table} `;

		return this;
	}

	public insertColumnNames(record: Record<string, any>): this {
		this.openParens();
		this.commaSeparate(Object.keys(record));
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

	public insert(options: InsertOptions): this {
		this.insertIntoStatement(options.table);
		if (!Array.isArray(options.records)) {
			options.records = [options.records];
		}

		if (options.records.length) {
			this.insertColumnNames(options.records[0]);
		}

		this.sql += 'VALUES ';

		for (let i = 0; i < options.records.length; i++) {
			const record = options.records[i];
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

		return this;
	}

	// ------------------------------------------------------------------------
	// Update
	// ------------------------------------------------------------------------

	public updateStatement(table: string): this {
		this.sql += `UPDATE ${table} `;

		return this;
	}

	public updateKeyValues(values: { [key: string]: any }): this {
		const keys = Object.keys(values);

		for (const key of keys) {
			this.sql += `${key} = `;
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
		this.sql += `DELETE FROM ${table} `;

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
	// General
	// ------------------------------------------------------------------------

	public appendPlaceholder(): this {
		this.sql += '? ';

		return this;
	}

	public placeholder(value: any): this {
		if (typeof value === 'object' && 'riao_column' in value) {
			this.sql += value.riao_column;
		}
		else {
			this.appendPlaceholder();
			this.params.push(value);
		}

		return this;
	}
}
