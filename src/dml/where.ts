import { DatabaseRecord } from '../record';
import { ColumnNameToken } from '../tokens';
import { ConditionToken, NotConditionToken } from '../conditions';
import { DatabaseFunctionToken } from '../functions';

export type WhereKeyVal<T extends DatabaseRecord = DatabaseRecord> = {
	[key in keyof Partial<T>]:
		| undefined
		| null
		| string
		| number
		| boolean
		| Date
		| bigint
		| ConditionToken
		| ColumnNameToken
		| DatabaseFunctionToken;
};

export type Where<T extends DatabaseRecord = DatabaseRecord> =
	| 'and'
	| 'or'
	| 'null'
	| WhereKeyVal<T>
	| NotConditionToken
	| Where<T>[];
