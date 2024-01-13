import { IdentifierToken } from './identifier';
import { Subquery } from '../dml';
import { Literal } from './literal';
import { DatabaseFunctionToken } from '../functions';

export type SimpleExpression =
	| Literal
	| IdentifierToken
	| DatabaseFunctionToken
	| Subquery;
