import { ExpressionTokenKey } from '../expression/expression-token';
import { ComparisonToken, ComparisonOperator } from './comparison-token';

export class Comparison {
	public static between(a: any, b: any): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.BETWEEN,
			value: { a, b },
		};
	}

	public static equals(value: any): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.EQUALS,
			value,
		};
	}

	public static notEqual(value: any): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.NOT_EQUAL,
			value,
		};
	}

	public static gt(value: any): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.GT,
			value,
		};
	}

	public static gte(value: any): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.GTE,
			value,
		};
	}

	public static inArray(values: any[]): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.IN_ARRAY,
			value: values,
		};
	}

	public static like(value: string): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.LIKE,
			value,
		};
	}

	public static lt(value: any): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.LT,
			value,
		};
	}

	public static lte(value: any): ComparisonToken {
		return {
			riao_expr: ExpressionTokenKey.COMPARISON,
			op: ComparisonOperator.LTE,
			value,
		};
	}
}
