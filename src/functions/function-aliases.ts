import { DatabaseFunctionToken } from './function-token';
import { DatabaseFunctions } from './functions';

export function count(): DatabaseFunctionToken {
	return DatabaseFunctions.count();
}

export function currentTimestamp(): DatabaseFunctionToken {
	return DatabaseFunctions.currentTimestamp();
}
