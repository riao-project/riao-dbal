import { ExpressionToken } from '../expression/expression-token';
import { ComparisonExpressionToken } from './comparison-token';

export function isComparisonToken(token: ExpressionToken): boolean {
	return token instanceof ComparisonExpressionToken;
}
