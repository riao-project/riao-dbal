import { ColumnType } from '../column';

/**
 * Database functions are typed by column type, so that users
 * 	gain strong typing when using functions, i.e. the user
 * 	can't assign a date function to a bool column.
 */
export type DatabaseFunctionReturnType = keyof typeof ColumnType;

export enum DatabaseFunctionKeys {
	CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP',
}

/**
 * A token is returned by database functions, so that it can be
 * 	interpreted during sql generation.
 */
export interface DatabaseFunctionToken<
	T extends DatabaseFunctionReturnType = DatabaseFunctionReturnType
> {
	riao_dbfn: DatabaseFunctionKeys;
	type: T;
	sql: string;
	params?: any[];
}
