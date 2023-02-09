import { DatabaseQueryOptions } from './query';
import { Where, WhereCondition } from './where';

export type SelectColumn = string;

export interface SelectQuery {
	columns?: SelectColumn[];
	from?: string;
	where?: Where | Where[];
}

export type Query = SelectQuery;

export class DatabaseQueryBuilder {
	protected sql = '';
	protected params: Record<string, any> = {};

	protected operators = {
		closeParens: ')',
		openParens: '(',
		equals: '=',
		notEqual: '!=',
		negate: '!',
		lt: '<',
		lte: '<=',
		gt: '>',
		gte: '>=',
		and: 'AND',
		or: 'OR',
		null: 'NULL',
		is: 'IS',
	};

	public selectColumnList(columns?: SelectColumn[]): this {
		this.sql += columns ? columns.join(', ') + ' ' : '* ';

		return this;
	}

	public selectFrom(from?: string): this {
		this.sql += from ? 'FROM ' + from + ' ' : ' ';

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

	public openParens(): this {
		this.sql += this.operators.openParens;

		return this;
	}

	public closeParens(): this {
		this.sql = this.sql.trimEnd();
		this.sql += this.operators.closeParens + ' ';

		return this;
	}

	public trimEnd(s: string) {
		s = s.trimEnd();
		this.sql = this.sql.trimEnd();
		this.sql = this.sql.substring(0, this.sql.length - s.length);
	}

	public whereClauseValue(value: null | boolean | number | string) {
		if (typeof value === 'boolean') {
			this.sql += `${value} `;
		}
		else if (typeof value === 'number') {
			this.sql += `${value} `;
		}
		else if (typeof value === 'string') {
			this.sql += `"${value}" `;
		}
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
						this.whereClauseValue(value.value);
					}
					else if (condition.condition === 'lt') {
						this.sql += key + ' ';
						this.lt();
						this.whereClauseValue(value.value);
					}
					else if (condition.condition === 'lte') {
						this.sql += key + ' ';
						this.lte();
						this.whereClauseValue(value.value);
					}
					else if (condition.condition === 'gt') {
						this.sql += key + ' ';
						this.gt();
						this.whereClauseValue(value.value);
					}
					else if (condition.condition === 'gte') {
						this.sql += key + ' ';
						this.gte();
						this.whereClauseValue(value.value);
					}
					else if (condition.condition === 'not') {
						this.sql += key + ' ';
						this.notEqual();
						this.whereClauseValue(value.value);
					}
				}
				else {
					this.sql += key + ' ';
					this.equals();
					this.whereClauseValue(value);
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

	public select(query: SelectQuery): this {
		this.selectStatement();
		this.selectColumnList(query.columns);
		this.selectFrom(query.from);

		if (query.where) {
			this.where(query.where);
		}

		return this;
	}

	public toDatabaseQuery(): DatabaseQueryOptions {
		return {
			sql: this.sql.trim(),
			params: this.params,
		};
	}
}
