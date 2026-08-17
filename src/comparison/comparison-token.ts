import { Expression } from '../expression';
import { DatabaseQueryOptions } from '../database';
import { SqlBuilder } from '../builder';
import { DatabaseQueryBuilder } from 'src/dml';
import { ExpressionToken } from 'src/expression/expression-token';

// TODO: Implement ExpressionToken after full conversion
export class ComparisonExpressionToken {
	protected queryBuilder: DatabaseQueryBuilder;

	protected setQueryBuilder(queryBuilder: DatabaseQueryBuilder) {
		this.queryBuilder = queryBuilder;
	}
}

export class ComparisonTokenWithValue extends ComparisonExpressionToken {
	protected value: Expression;

	public constructor(options: { value: Expression }) {
		super();

		this.value = options.value;
	}
}

export class EqualComparisonToken extends ComparisonTokenWithValue {
	public buildSql(builder: DatabaseQueryBuilder): void {
		this.queryBuilder.append('= ');
		this.queryBuilder.placeholder(this.value);
	}
}

export class NotEqualComparisonToken extends ComparisonTokenWithValue {
	public buildSql(builder: SqlBuilder): void {
		this.queryBuilder.append('!= ');
		this.queryBuilder.placeholder(this.value);
	}
}

export class LikeComparisonToken extends ComparisonTokenWithValue {
	public buildSql(builder: SqlBuilder): void {
		this.queryBuilder.append('LIKE ');
		this.queryBuilder.placeholder(this.value);
	}
}

export class LessThanComparisonToken extends ComparisonTokenWithValue {
	public buildSql(builder: SqlBuilder): void {
		this.queryBuilder.append('< ');
		this.queryBuilder.placeholder(this.value);
	}
}

export class LessThanOrEqualComparisonToken extends ComparisonTokenWithValue {
	public buildSql(builder: SqlBuilder): void {
		this.queryBuilder.append('<= ');
		this.queryBuilder.placeholder(this.value);
	}
}

export class GreaterThanComparisonToken extends ComparisonTokenWithValue {
	public buildSql(builder: SqlBuilder): void {
		this.queryBuilder.append('> ');
		this.queryBuilder.placeholder(this.value);
	}
}

export class GreaterThanOrEqualComparisonToken extends ComparisonTokenWithValue {
	public buildSql(builder: SqlBuilder): void {
		this.queryBuilder.append('>= ');
		this.queryBuilder.placeholder(this.value);
	}
}

export class InArrayComparisonToken extends ComparisonExpressionToken {
	protected values: Expression[];

	public constructor(options: { values: Expression[] }) {
		super();

		this.values = options.values;
	}

	public buildSql(builder: SqlBuilder): void {
		this.queryBuilder.append(this.queryBuilder.operators.in);

		this.queryBuilder.openParens();

		for (const value of values) {
			this.expression(value);
			this.queryBuilder.append(', ');
		}

		this.queryBuilder.trimEnd(', ');

		this.queryBuilder.closeParens();
	}
}

export class BetweenComparisonToken extends ComparisonExpressionToken {
	protected a: Expression;
	protected b: Expression;

	public constructor(options: { a: Expression; b: Expression }) {
		super();

		this.a = options.a;
		this.b = options.b;
	}

	public getSql(): DatabaseQueryOptions {
		return { sql: 'BETWEEN' };
	}
}
