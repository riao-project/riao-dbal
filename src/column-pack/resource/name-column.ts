import { ColumnOptions, ColumnType } from '../../column';

export const NameColumn: ColumnOptions = {
	name: 'name',
	type: ColumnType.VARCHAR,
	length: 255,
	required: true,
};
