import { Token } from '../comparison/comparison-token';
import { ExpressionToken } from './expression-token';

function isInstanceOf(target: any, baseClass: Function): boolean {
	return target instanceof baseClass;
}

export function isExpressionToken(val: any | ExpressionToken): boolean {
	if (val && typeof val === 'object' && isInstanceOf(val, Token)) {
		return true;
	}

	// TODO: Remove after refactoring rest of tokens
	return val && typeof val === 'object' && 'riao_expr' in val;
}
