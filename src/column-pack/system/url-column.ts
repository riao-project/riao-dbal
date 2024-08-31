import { ColumnOptions, ColumnType } from '../../column';

export const UrlColumn: ColumnOptions = {
	name: 'url',
	type: ColumnType.VARCHAR,
	length: 2083,
};

export const UrlTextColumn: ColumnOptions = {
	name: 'url',
	type: ColumnType.TEXT,
};
