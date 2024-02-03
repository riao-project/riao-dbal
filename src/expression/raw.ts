import { ExpressionToken, ExpressionTokenKey } from './expression-token';

export interface RawExpressionToken extends ExpressionToken {
	riao_expr: ExpressionTokenKey.RAW;
	sql: string;
	params?: any[];
}

export function isRawExprToken(token: ExpressionToken): boolean {
	return token.riao_expr === ExpressionTokenKey.RAW;
}

export function raw(sql: string, params?: any[]): RawExpressionToken {
	return {
		riao_expr: ExpressionTokenKey.RAW,
		sql,
		params,
	};
}
