import { IdentifierToken } from './identifier';
import { Subquery } from '../dml';
import { Literal } from './literal';
import { DatabaseFunctionToken } from '../functions';
import { MathToken } from './math';
import { RawExpressionToken } from './raw';

export type SimpleExpression =
	| Literal
	| RawExpressionToken
	| IdentifierToken
	| MathToken
	| DatabaseFunctionToken
	| Subquery
	| SimpleExpression[];
