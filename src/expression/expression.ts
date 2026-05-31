import { ComparisonToken } from '../comparison';
import { DatabaseRecord } from '../record';
import { KeyValExpression } from './key-val-expression';
import { ExistsToken, LogicalToken, NotToken } from './logical';
import { SimpleExpression } from './simple-expression';

export type Expression<T extends DatabaseRecord = DatabaseRecord> =
	| SimpleExpression
	| LogicalToken
	| NotToken
	| ExistsToken
	| ComparisonToken
	| KeyValExpression<T>
	| Expression<T>[];
