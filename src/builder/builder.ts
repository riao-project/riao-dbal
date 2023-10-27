import { DatabaseFunctionToken } from '../functions/function-interface';
import { DatabaseQueryOptions } from '../database/driver-query';

export abstract class Builder {
	protected sql = '';
	protected params: any[] = [];

	protected operators = {
		closeParens: ')',
		openParens: '(',
		equals: '=',
		like: 'LIKE',
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
		in: 'IN',
	};

	public commaSeparate(strings: string[]): this {
		this.sql += strings.join(', ');

		return this;
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

	public trimEnd(s: string): this {
		s = s.trimEnd();
		this.sql = this.sql.trimEnd();
		this.sql = this.sql.substring(0, this.sql.length - s.length);

		return this;
	}

	public toDatabaseQuery(): DatabaseQueryOptions {
		return {
			sql: this.sql.trim(),
			params: this.params,
		};
	}

	// ------------------------------------------------------------------------
	// General
	// ------------------------------------------------------------------------

	public appendPlaceholder(): this {
		this.sql += '? ';

		return this;
	}

	public placeholder(value: any): this {
		if (value === null) {
			this.appendPlaceholder();
			this.params.push(value);
		}
		else if (typeof value === 'object' && 'riao_column' in value) {
			this.sql += value.riao_column;
		}
		else if (this.isDatabaseFunction(value)) {
			this.databaseFunction(value);
		}
		else {
			this.appendPlaceholder();
			this.params.push(value);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Database Functions
	// ------------------------------------------------------------------------

	/**
	 * Check if a value is a database function token
	 *
	 * @param fn Value to check
	 * @returns Returns true if the value is a database function
	 */
	public isDatabaseFunction(fn: any): boolean {
		return typeof fn === 'object' && 'riao_dbfn' in fn;
	}

	/**
	 * Append a database function the query
	 *
	 * @param fn Database function token
	 */
	public databaseFunction(fn: DatabaseFunctionToken) {
		this.sql += fn.sql;

		if (Array.isArray(fn.params)) {
			this.openParens();

			for (const param of fn.params) {
				this.placeholder(param);
				this.sql += ',';
				this.trimEnd(',');
			}

			this.closeParens();
		}

		this.trimEnd(' ');
	}
}
