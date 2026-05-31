import { Expression } from './expression';
import { ExpressionToken, ExpressionTokenKey } from './expression-token';
import { Subquery } from '../dml/subquery';

export enum LogicalOperator {
	AND = 'AND',
	OR = 'OR',
	NOT = 'NOT',
	EXISTS = 'EXISTS',
	NOT_EXISTS = 'NOT_EXISTS',
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

export interface ExistsToken extends ExpressionToken {
	op: LogicalOperator.EXISTS | LogicalOperator.NOT_EXISTS;
	query: Subquery;
}

export function exists(query: Subquery): ExistsToken {
	return {
		riao_expr: ExpressionTokenKey.LOGICAL,
		op: LogicalOperator.EXISTS,
		query,
	};
}

export function notExists(query: Subquery): ExistsToken {
	return {
		riao_expr: ExpressionTokenKey.LOGICAL,
		op: LogicalOperator.NOT_EXISTS,
		query,
	};
}

export function isExistsToken(token: ExpressionToken): boolean {
	return (
		token.riao_expr === ExpressionTokenKey.LOGICAL &&
		((token as ExistsToken).op === LogicalOperator.EXISTS ||
			(token as ExistsToken).op === LogicalOperator.NOT_EXISTS)
	);
}
