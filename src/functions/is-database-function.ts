import {
	ExpressionToken,
	ExpressionTokenKey,
} from '../expression/expression-token';

/**
 * Check if a value is a database function token
 *
 * @param token Value to check
 * @returns Returns true if the value is a database function
 */
export function isDatabaseFunction(token: ExpressionToken): boolean {
	return token.riao_expr === ExpressionTokenKey.FUNCTION_CALL;
}
