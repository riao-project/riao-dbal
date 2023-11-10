import {
	DatabaseFunctionKeys,
	DatabaseFunctionToken,
} from '../functions/function-token';
import { DatabaseQueryOptions } from '../database/driver-query';
import { isDatabaseFunction } from '../functions';
import { Builder } from './builder';

export class SqlBuilder extends Builder {
	protected sql = '';
	protected params: any[] = [];

	public operators = {
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

	public toDatabaseQuery(): DatabaseQueryOptions {
		return {
			sql: this.sql.trim(),
			params: this.params,
		};
	}

	// ------------------------------------------------------------------------
	// SQL utility functions
	// ------------------------------------------------------------------------

	public append(str: string): this {
		this.sql += str;

		return this;
	}

	public space(): this {
		this.sql += ' ';

		return this;
	}

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

	public trimEnd(s?: string): this {
		this.sql = this.sql.trimEnd();

		if (s) {
			s = s.trimEnd();
			this.sql = this.sql.substring(0, this.sql.length - s.length);
		}

		return this;
	}

	// ------------------------------------------------------------------------
	// Column/Table reference enclosure
	// ------------------------------------------------------------------------

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
	// Placeholders
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
		else if (isDatabaseFunction(value)) {
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
