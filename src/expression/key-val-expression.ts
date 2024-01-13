import { ComparisonToken } from 'src/comparison';
import { DatabaseRecord } from '../record';
import { NotToken } from './logical';
import { SimpleExpression } from './simple-expression';

export type KeyValExpression<T extends DatabaseRecord = DatabaseRecord> = {
	[key in keyof Partial<T>]: SimpleExpression | ComparisonToken | NotToken;
};
