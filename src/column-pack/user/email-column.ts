import { ColumnOptions, ColumnType } from '../../column';

export const EmailColumn: ColumnOptions = {
	name: 'email',
	type: ColumnType.VARCHAR,
	length: 255,
	required: true,
	isUnique: true,
};
