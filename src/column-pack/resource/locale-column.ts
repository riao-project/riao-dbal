import { ColumnOptions, ColumnType } from '../../column';

export const LocaleColumn: ColumnOptions = {
	name: 'locale',
	type: ColumnType.VARCHAR,
	length: 16,
	required: false,
};