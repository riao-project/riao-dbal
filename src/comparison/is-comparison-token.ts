import {
	ExpressionToken,
	ExpressionTokenKey,
} from '../expression/expression-token';

export function isComparisonToken(token: ExpressionToken): boolean {
	return token.riao_expr === ExpressionTokenKey.COMPARISON;
}
