import { ColumnOptions, ColumnType } from '../../column';

export const LastLoginTimestampColumn: ColumnOptions = {
	name: 'last_login_timestamp',
	type: ColumnType.TIMESTAMP,
	required: false,
};