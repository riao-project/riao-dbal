import {
	DatabaseFunctionKeys,
	DatabaseFunctionToken,
} from '../functions/function-token';
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
		between: 'BETWEEN',
		openEnclosure: '"',
		closeEnclosure: '"',
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

	public encloseString(str: string): string {
		if (!str) {
			return str;
		}

		return (
			this.operators.openEnclosure + str + this.operators.closeEnclosure
		);
	}

	public getEnclosedName(str: string): string {
		if (str.includes('.')) {
			return str
				.split('.')
				.map((part) => this.encloseString(part))
				.join('.');
		}
		else {
			return this.encloseString(str);
		}
	}

	public tableName(name: string): this {
		this.sql += this.getEnclosedName(name);

		return this;
	}

	public columnName(name: string): this {
		this.sql += this.getEnclosedName(name);

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
		if (value === null) {
			this.appendPlaceholder();
			this.params.push(value);
		}
		else if (typeof value === 'object' && 'riao_column' in value) {
			this.columnName(value.riao_column);
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
	public databaseFunction(fn: DatabaseFunctionToken): this {
		switch (fn.riao_dbfn) {
		case DatabaseFunctionKeys.COUNT:
			this.count(fn);
			break;

		case DatabaseFunctionKeys.CURRENT_TIMESTAMP:
			this.currentTimestamp(fn);
			break;
		}

		return this;
	}

	public count(fn: DatabaseFunctionToken): this {
		this.sql += 'COUNT(*)';

		return this;
	}

	public currentTimestamp(fn: DatabaseFunctionToken): this {
		this.sql += 'CURRENT_TIMESTAMP';

		return this;
	}
}
