import { DatabaseQueryOptions } from '../database/driver-query';
import { Builder } from './builder';

export class SqlBuilder extends Builder {
	protected sql = '';
	protected params: any[] = [];

	public operators = {
		closeParens: ')',
		openParens: '(',
		endStatement: ';',
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
		addition: '+',
		subtraction: '-',
		multiplication: '*',
		division: '/',
		modulo: '%',
	};

	public override toDatabaseQuery(): DatabaseQueryOptions {
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

	public appendParams(params: any[]) {
		this.params = this.params.concat(params);
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

	public endStatement(): this {
		this.sql += this.operators.endStatement + ' ';

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

	public appendPlaceholder(value: any): this {
		this.sql += '? ';

		return this;
	}

	public placeholder(value: any): this {
		this.appendPlaceholder(value);
		this.params.push(value);

		return this;
	}
}
