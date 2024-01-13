import { ExpressionToken, ExpressionTokenKey } from './expression-token';

export interface Identifier {
	name: string;
}

export type IdentifierToken = ExpressionToken & Identifier;

export function identifier(name: string): IdentifierToken {
	return {
		riao_expr: ExpressionTokenKey.IDENTIFIER,
		name,
	};
}

export function isIdentifierToken(token: ExpressionToken): boolean {
	return token.riao_expr === ExpressionTokenKey.IDENTIFIER;
}
