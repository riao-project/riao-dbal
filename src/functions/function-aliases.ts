import { DatabaseFunctionToken } from './function-token';
import { DatabaseFunctions } from './functions';
import { CountParams } from './signatures/count';
import { Expression } from '../expression';

export function count(params: CountParams): DatabaseFunctionToken {
	return DatabaseFunctions.count(params);
}

export function currentTimestamp(): DatabaseFunctionToken {
	return DatabaseFunctions.currentTimestamp();
}

export function round(
	expr: Expression,
	decimals?: number
): DatabaseFunctionToken {
	return DatabaseFunctions.round(expr, decimals);
}
