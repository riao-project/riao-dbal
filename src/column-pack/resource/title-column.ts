import { ColumnOptions, ColumnType } from '../../column';

export const TitleColumn: ColumnOptions = {
	name: 'title',
	type: ColumnType.VARCHAR,
	length: 1024,
	required: true,
};
