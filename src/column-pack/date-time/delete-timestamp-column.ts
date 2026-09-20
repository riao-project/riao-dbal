import { ColumnOptions, ColumnType } from '../../column';

export const DeleteTimestampColumn: ColumnOptions = {
	name: 'delete_timestamp',
	type: ColumnType.TIMESTAMP,
	required: false,
};