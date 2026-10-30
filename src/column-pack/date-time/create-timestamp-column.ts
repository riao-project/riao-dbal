import { ColumnOptions, ColumnType } from '../../column';
import { DatabaseFunctions } from '../../functions';

export const CreateTimestampColumn: ColumnOptions = {
	type: ColumnType.TIMESTAMP,
	name: 'created_at',
	default: DatabaseFunctions.currentTimestamp(),
};
