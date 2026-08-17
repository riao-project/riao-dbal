import { Expression } from '../expression';
import {
	ComparisonExpressionToken,
	BetweenComparisonToken,
	EqualComparisonToken,
	NotEqualComparisonToken,
	GreaterThanComparisonToken,
	GreaterThanOrEqualComparisonToken,
	InArrayComparisonToken,
	LikeComparisonToken,
	LessThanComparisonToken,
	LessThanOrEqualComparisonToken,
} from './comparison-token';

export class Comparison {
	public static between(
		a: Expression,
		b: Expression
	): ComparisonExpressionToken {
		return new BetweenComparisonToken({ a, b });
	}

	public static equals(value: Expression): ComparisonExpressionToken {
		return new EqualComparisonToken({ value });
	}

	public static notEqual(value: Expression): ComparisonExpressionToken {
		return new NotEqualComparisonToken({ value });
	}

	public static gt(value: Expression): ComparisonExpressionToken {
		return new GreaterThanComparisonToken({ value });
	}

	public static gte(value: Expression): ComparisonExpressionToken {
		return new GreaterThanOrEqualComparisonToken({ value });
	}

	public static inArray(values: Expression[]): ComparisonExpressionToken {
		return new InArrayComparisonToken({ values });
	}

	public static like(value: Expression): ComparisonExpressionToken {
		return new LikeComparisonToken({ value });
	}

	public static lt(value: Expression): ComparisonExpressionToken {
		return new LessThanComparisonToken({ value });
	}

	public static lte(value: Expression): ComparisonExpressionToken {
		return new LessThanOrEqualComparisonToken({ value });
	}
}
