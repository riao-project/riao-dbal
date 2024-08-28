import { ColumnOptions, ColumnType } from '../../column';

export const PasswordColumn: ColumnOptions = {
	name: 'password',
	type: ColumnType.VARCHAR,
	length: 128,
	required: true,
};
