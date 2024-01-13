export enum ExpressionTokenKey {
	IDENTIFIER = 'identifier',
	FUNCTION_CALL = 'function',
	COMPARISON = 'comparison',
	LOGICAL = 'logical',
}

export interface ExpressionToken {
	riao_expr: ExpressionTokenKey;
}
