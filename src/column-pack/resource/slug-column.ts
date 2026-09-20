import { ColumnOptions, ColumnType } from '../../column';

export const SlugColumn: ColumnOptions = {
	name: 'slug',
	type: ColumnType.VARCHAR,
	length: 255,
	isUnique: true,
	required: true,
};
