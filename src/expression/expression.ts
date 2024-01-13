import { ComparisonToken } from '../comparison';
import { DatabaseRecord } from '../record';
import { KeyValExpression } from './key-val-expression';
import { LogicalToken, NotToken } from './logical';
import { SimpleExpression } from './simple-expression';

export type Expression<T extends DatabaseRecord = DatabaseRecord> =
	| SimpleExpression
	| LogicalToken
	| NotToken
	| ComparisonToken
	| KeyValExpression<T>
	| Expression<T>[];
