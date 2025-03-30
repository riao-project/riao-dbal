import { ColumnTriggerOptions, ColumnOptions, ColumnType } from '../../column';
import { DatabaseFunctions } from '../../functions';
import { UpdateTimestampTrigger } from '../../triggers/prebuilt';

export const UpdateTimestampColumn: ColumnOptions = {
	type: ColumnType.TIMESTAMP,
	name: 'update_timestamp',
	default: DatabaseFunctions.currentTimestamp(),
	triggers: (options: ColumnTriggerOptions) => [
		new UpdateTimestampTrigger(options),
	],
};
