import { IdentifierToken } from './identifier';
import { Subquery } from '../dml';
import { Literal } from './literal';
import { DatabaseFunctionToken } from '../functions';
import { MathToken } from './math';

export type SimpleExpression =
	| Literal
	| IdentifierToken
	| MathToken
	| DatabaseFunctionToken
	| Subquery
	| SimpleExpression[];
