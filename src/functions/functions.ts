import { ColumnType } from '../column';
import {
	DatabaseFunctionKeys,
	DatabaseFunctionToken,
} from './function-interface';

export class DatabaseFunctions {
	// ------------------------------------------------------------------------
	// Date/Time functions
	// ------------------------------------------------------------------------

	public currentTimestamp(): DatabaseFunctionToken<ColumnType.DATETIME> {
		return {
			riao_dbfn: DatabaseFunctionKeys.CURRENT_TIMESTAMP,
			type: ColumnType.DATETIME,
		};
	}
}
