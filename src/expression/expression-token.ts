export enum ExpressionTokenKey {
	IDENTIFIER = 'identifier',
	FUNCTION_CALL = 'function',
	COMPARISON = 'comparison',
	LOGICAL = 'logical',
	MATH = 'math',
	RAW = 'raw',
}

export interface ExpressionToken {
	riao_expr: ExpressionTokenKey;
}
