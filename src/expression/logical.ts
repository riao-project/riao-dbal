import { Expression } from './expression';
import { ExpressionToken, ExpressionTokenKey } from './expression-token';

export enum LogicalOperator {
	AND = 'AND',
	OR = 'OR',
	NOT = 'NOT',
}

export interface LogicalToken extends ExpressionToken {
	op: LogicalOperator;
}

export function isLogicalToken(token: ExpressionToken): boolean {
	return token.riao_expr === ExpressionTokenKey.LOGICAL;
}

export const and: LogicalToken = {
	riao_expr: ExpressionTokenKey.LOGICAL,
	op: LogicalOperator.AND,
};

export const or: LogicalToken = {
	riao_expr: ExpressionTokenKey.LOGICAL,
	op: LogicalOperator.OR,
};

export interface NotToken extends ExpressionToken {
	op: LogicalOperator.NOT;
	expr: Expression;
}

export function not(expr: Expression): NotToken {
	return {
		riao_expr: ExpressionTokenKey.LOGICAL,
		op: LogicalOperator.NOT,
		expr,
	};
}
