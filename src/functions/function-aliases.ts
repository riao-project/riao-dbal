import { DatabaseFunctionToken } from './function-token';
import { DatabaseFunctions } from './functions';
import { CountParams } from './signatures/count';

export function count(params: CountParams): DatabaseFunctionToken {
	return DatabaseFunctions.count(params);
}

export function currentTimestamp(): DatabaseFunctionToken {
	return DatabaseFunctions.currentTimestamp();
}
