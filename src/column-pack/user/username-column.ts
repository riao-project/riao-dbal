import { ColumnOptions, ColumnType } from '../../column';

export const UsernameColumn: ColumnOptions = {
	name: 'username',
	type: ColumnType.VARCHAR,
	length: 64,
	isUnique: true,
	required: false,
};
