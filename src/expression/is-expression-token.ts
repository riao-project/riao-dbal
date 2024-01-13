import { ExpressionToken } from './expression-token';

export function isExpressionToken(val: any | ExpressionToken): boolean {
	return val && typeof val === 'object' && 'riao_expr' in val;
}
