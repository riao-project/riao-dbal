import { ExpressionToken } from '../expression/expression-token';
import { ColumnType } from '../column';

/**
 * Database functions are typed by column type, so that users
 * 	gain strong typing when using functions, i.e. the user
 * 	can't assign a date function to a bool column.
 */
export type DatabaseFunctionReturnType = keyof typeof ColumnType;

export enum DatabaseFunctionKeys {
	COUNT,
	MIN,
	CURRENT_TIMESTAMP,
}

export interface DatabaseFunction<
	T extends DatabaseFunctionReturnType = DatabaseFunctionReturnType
> {
	fn: DatabaseFunctionKeys;
	type: T;
	params?: any;
}

/**
 * A token is returned by database functions, so that it can be
 * 	interpreted during sql generation.
 */
export type DatabaseFunctionToken<
	T extends DatabaseFunctionReturnType = DatabaseFunctionReturnType
> = ExpressionToken & DatabaseFunction<T>;
