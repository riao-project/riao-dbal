import { ColumnOptions, ColumnType } from '../../column';

export const PathColumn: ColumnOptions = {
	name: 'path',
	type: ColumnType.VARCHAR,
	length: 255,
	isUnique: true,
	required: true,
};
