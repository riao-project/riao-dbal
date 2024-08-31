import { ColumnOptions, ColumnType } from '../../column';
import { DatabaseFunctions } from '../../functions';

export const CreateTimestampColumn: ColumnOptions = {
	type: ColumnType.TIMESTAMP,
	name: 'create_timestamp',
	default: DatabaseFunctions.currentTimestamp(),
};
