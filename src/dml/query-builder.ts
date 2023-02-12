import { InsertOptions } from './insert';
import { Where, WhereCondition } from './where';
import { SelectColumn, SelectQuery } from './select';
import { UpdateOptions } from './update';
import { DeleteOptions } from './delete';
import { Builder } from '../builder';
import { OrderBy } from './order-by';

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

	public equals() {
		this.sql += this.operators.equals + ' ';
	}

	public lt() {
		this.sql += this.operators.lt + ' ';
	}

	public lte() {
		this.sql += this.operators.lte + ' ';
	}

	public gt() {
		this.sql += this.operators.gt + ' ';
	}

	public gte() {
		this.sql += this.operators.gte + ' ';
	}

	public notEqual() {
		this.sql += this.operators.notEqual + ' ';
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

	public whereClause(where: Where | Where[]): this {
		if (Array.isArray(where)) {
			this.openParens();

			for (const w of where) {
				this.whereClause(w);
			}

			this.closeParens();
		}
		else if (typeof where === 'object' && where.riao_isGroup) {
			delete where.riao_isGroup;

			if (where.condition === 'not') {
				this.sql += this.operators.negate;
			}

			this.whereClause(where.value);
		}
		else if (typeof where === 'object') {
			this.openParens();

			for (const key in where) {
				const value = where[key];

				if (value === null) {
					this.sql += key + ' ';
					this.isNull();
				}
				else if (typeof value === 'object') {
					const condition = value as WhereCondition;

					if (condition.condition === 'equals') {
						this.sql += key + ' ';
						this.equals();
						this.placeholder(value.value);
					}
					else if (condition.condition === 'lt') {
						this.sql += key + ' ';
						this.lt();
						this.placeholder(value.value);
					}
					else if (condition.condition === 'lte') {
						this.sql += key + ' ';
						this.lte();
						this.placeholder(value.value);
					}
					else if (condition.condition === 'gt') {
						this.sql += key + ' ';
						this.gt();
						this.placeholder(value.value);
					}
					else if (condition.condition === 'gte') {
						this.sql += key + ' ';
						this.gte();
						this.placeholder(value.value);
					}
					else if (condition.condition === 'not') {
						this.sql += key + ' ';
						this.notEqual();
						this.placeholder(value.value);
					}
				}
				else {
					this.sql += key + ' ';
					this.equals();
					this.placeholder(value);
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
		this.selectFrom(query.from);

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
	// Insert
	// ------------------------------------------------------------------------

	public insertIntoStatement(table: string): this {
		this.sql += `INSERT INTO ${table} `;

		return this;
	}

	public insertColumnNames(record: Record<string, any>): this {
		this.openParens();

		this.sql += Object.keys(record)
			.map((key) => '`' + key + '`')
			.join(', ');

		this.closeParens();

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

		return this;
	}

	// ------------------------------------------------------------------------
	// Update
	// ------------------------------------------------------------------------

	public updateStatement(table: string): this {
		this.sql += `UPDATE ${table} `;

		return this;
	}

	public updateSetStatement(values: { [key: string]: any }): this {
		const keys = Object.keys(values);

		this.sql += 'SET ';

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

	public update(options: UpdateOptions): this {
		this.updateStatement(options.table).updateSetStatement(options.set);

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
		this.appendPlaceholder();
		this.params.push(value);

		return this;
	}
}
