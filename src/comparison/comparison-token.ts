import { ExpressionToken } from '../expression/expression-token';

export enum ComparisonOperator {
	EQUALS,
	NOT_EQUAL,
	LIKE,
	LT,
	LTE,
	GT,
	GTE,
	IN_ARRAY,
	BETWEEN,
}

export interface ComparisonInterface {
	op: ComparisonOperator;
	value: any;
}

export type ComparisonToken = ExpressionToken & ComparisonInterface;
