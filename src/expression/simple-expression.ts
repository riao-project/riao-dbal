import { IdentifierToken } from './identifier';
import { Subquery } from '../dml';
import { Literal } from './literal';
import { DatabaseFunctionToken } from '../functions';
import { MathToken } from './math';
import { RawExpressionToken } from './raw';
import { CaseExpression } from '../dml/case-expression';

export type SimpleExpression =
	| Literal
	| RawExpressionToken
	| IdentifierToken
	| MathToken
	| DatabaseFunctionToken
	| Subquery
	| CaseExpression
	| SimpleExpression[];
