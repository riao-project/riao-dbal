import { DatabaseQueryOptions } from './query';

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
}
