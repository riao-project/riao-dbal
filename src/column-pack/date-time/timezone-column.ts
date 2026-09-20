import { ColumnOptions, ColumnType } from '../../column';

export const TimezoneColumn: ColumnOptions = {
	name: 'timezone',
	type: ColumnType.VARCHAR,
	length: 64,
	required: false,
};