import { Expression } from '../expression';
import { ExpressionTokenKey } from '../expression/expression-token';
import { ColumnType } from '../column';
import { DatabaseFunctionKeys, DatabaseFunctionToken } from './function-token';
import { CountParams } from './signatures/count';

export class DatabaseFunctions {
	// ------------------------------------------------------------------------
	// Math functions
	// ------------------------------------------------------------------------

	public static average(
		expr: Expression,
		options: {
			distinct?: boolean;
		} = {}
	): DatabaseFunctionToken {
		return {
			riao_expr: ExpressionTokenKey.FUNCTION_CALL,
			fn: DatabaseFunctionKeys.AVERAGE,
			type: ColumnType.BIGINT,
			params: {
				expr,
				options,
			},
		};
	}

	public static count(
		params: CountParams = {}
	): DatabaseFunctionToken<ColumnType.BIGINT> {
		return {
			riao_expr: ExpressionTokenKey.FUNCTION_CALL,
			fn: DatabaseFunctionKeys.COUNT,
			type: ColumnType.BIGINT,
			params,
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

	public static max(expr: Expression): DatabaseFunctionToken {
		return {
			riao_expr: ExpressionTokenKey.FUNCTION_CALL,
			fn: DatabaseFunctionKeys.MAX,
			type: ColumnType.BIGINT,
			params: expr,
		};
	}

	public static sum(
		expr: Expression,
		options: {
			distinct?: boolean;
		} = {}
	): DatabaseFunctionToken {
		return {
			riao_expr: ExpressionTokenKey.FUNCTION_CALL,
			fn: DatabaseFunctionKeys.SUM,
			type: ColumnType.BIGINT,
			params: {
				expr,
				options,
			},
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
