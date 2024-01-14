import { Expression } from '../expression';
import { ExpressionTokenKey } from '../expression/expression-token';
import { ColumnType } from '../column';
import { DatabaseFunctionKeys, DatabaseFunctionToken } from './function-token';

export class DatabaseFunctions {
	// ------------------------------------------------------------------------
	// Math functions
	// ------------------------------------------------------------------------

	public static count(): DatabaseFunctionToken<ColumnType.BIGINT> {
		return {
			riao_expr: ExpressionTokenKey.FUNCTION_CALL,
			fn: DatabaseFunctionKeys.COUNT,
			type: ColumnType.BIGINT,
		};
	}

	public static min(expr: Expression): DatabaseFunctionToken {
		return {
			riao_expr: ExpressionTokenKey.FUNCTION_CALL,
			fn: DatabaseFunctionKeys.MIN,
			type: ColumnType.BIGINT,
			params: expr,
		};
	}

	// ------------------------------------------------------------------------
	// Date/Time functions
	// ------------------------------------------------------------------------

	public static currentTimestamp(): DatabaseFunctionToken<ColumnType.TIMESTAMP> {
		return {
			riao_expr: ExpressionTokenKey.FUNCTION_CALL,
			fn: DatabaseFunctionKeys.CURRENT_TIMESTAMP,
			type: ColumnType.TIMESTAMP,
		};
	}
}
