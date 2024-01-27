import { Expression } from './expression';
import { ExpressionToken, ExpressionTokenKey } from './expression-token';

export enum MathOperation {
	ADD,
	SUB,
	MUL,
	DIV,
	MOD,
}

export interface MathToken extends ExpressionToken {
	op: MathOperation;
}

export function isMathToken(token: ExpressionToken): boolean {
	return token.riao_expr === ExpressionTokenKey.MATH;
}

export const plus: MathToken = {
	riao_expr: ExpressionTokenKey.MATH,
	op: MathOperation.ADD,
};

export const minus: MathToken = {
	riao_expr: ExpressionTokenKey.MATH,
	op: MathOperation.SUB,
};

export const times: MathToken = {
	riao_expr: ExpressionTokenKey.MATH,
	op: MathOperation.MUL,
};

export const divide: MathToken = {
	riao_expr: ExpressionTokenKey.MATH,
	op: MathOperation.DIV,
};

export const modulo: MathToken = {
	riao_expr: ExpressionTokenKey.MATH,
	op: MathOperation.MOD,
};
