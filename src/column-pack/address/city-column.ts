import { ColumnOptions, ColumnType } from '../../column';

export const CityColumn: ColumnOptions = {
	name: 'city',
	type: ColumnType.VARCHAR,
	length: 255,
	required: false,
};