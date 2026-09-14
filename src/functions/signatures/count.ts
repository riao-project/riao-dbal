import { Expression } from '../../expression';

export interface CountBaseParams {
	distinct?: boolean;
}

export interface CountExpressionParams {
	expr?: Expression;
}

export interface CountColumnParams {
	column?: string;
}

export interface CountColumnsParams {
	columns?: string[];
}

export type CountParams = CountBaseParams &
	(CountExpressionParams | CountColumnParams | CountColumnsParams);
