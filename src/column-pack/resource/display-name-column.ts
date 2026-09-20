import { ColumnOptions, ColumnType } from '../../column';

export const DisplayNameColumn: ColumnOptions = {
	name: 'display_name',
	type: ColumnType.VARCHAR,
	length: 255,
	required: false,
};