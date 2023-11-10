import { ColumnType } from '../column';
import { DatabaseFunctionKeys, DatabaseFunctionToken } from './function-token';

export class DatabaseFunctions {
	// ------------------------------------------------------------------------
	// Math functions
	// ------------------------------------------------------------------------

	public static count(): DatabaseFunctionToken<ColumnType.BIGINT> {
		return {
			riao_dbfn: DatabaseFunctionKeys.COUNT,
			type: ColumnType.BIGINT,
		};
	}

	// ------------------------------------------------------------------------
	// Date/Time functions
	// ------------------------------------------------------------------------

	public static currentTimestamp(): DatabaseFunctionToken<ColumnType.TIMESTAMP> {
		return {
			riao_dbfn: DatabaseFunctionKeys.CURRENT_TIMESTAMP,
			type: ColumnType.TIMESTAMP,
		};
	}
}
