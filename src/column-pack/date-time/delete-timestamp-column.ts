import { ColumnOptions, ColumnType } from '../../column';

export const DeleteTimestampColumn: ColumnOptions = {
	name: 'deleted_at',
	type: ColumnType.TIMESTAMP,
	required: false,
};