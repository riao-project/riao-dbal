import { ColumnType } from '../column';
import {
	DatabaseFunctionKeys,
	DatabaseFunctionToken,
} from './function-interface';

export class DatabaseFunctions {
	// ------------------------------------------------------------------------
	// Math functions
	// ------------------------------------------------------------------------

	public count(): DatabaseFunctionToken<ColumnType.BIGINT> {
		return {
			riao_dbfn: DatabaseFunctionKeys.COUNT,
			type: ColumnType.BIGINT,
			sql: 'COUNT(*)',
		};
	}

	// ------------------------------------------------------------------------
	// Date/Time functions
	// ------------------------------------------------------------------------

	public currentTimestamp(): DatabaseFunctionToken<ColumnType.TIMESTAMP> {
		return {
			riao_dbfn: DatabaseFunctionKeys.CURRENT_TIMESTAMP,
			type: ColumnType.TIMESTAMP,
			sql: 'CURRENT_TIMESTAMP',
		};
	}
}
