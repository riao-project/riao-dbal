import { ColumnOptions, ColumnType } from '../../column';

export const RegionColumn: ColumnOptions = {
	name: 'region',
	type: ColumnType.VARCHAR,
	length: 255,
	required: false,
};