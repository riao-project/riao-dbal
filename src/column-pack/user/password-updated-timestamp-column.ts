import { ColumnOptions, ColumnType } from '../../column';

export const PasswordUpdatedTimestampColumn: ColumnOptions = {
	name: 'password_updated_timestamp',
	type: ColumnType.TIMESTAMP,
	required: false,
};