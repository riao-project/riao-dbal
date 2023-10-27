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

	public getEnclosedName(str: string): string {
		return '"' + str + '"';
	}

	public tableName(name: string): this {
		if (name.includes('.')) {
			this.sql += name
				.split('.')
				.map((part) => this.getEnclosedName(part))
				.join('.');
		}
		else {
			this.sql += this.getEnclosedName(name);
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
		this.sql += fn.riao_dbfn;
	}
}
