import { ColumnOptions, ColumnType } from '../../column';

export const EmailVerifiedTimestampColumn: ColumnOptions = {
	name: 'email_verified_at',
	type: ColumnType.TIMESTAMP,
	required: false,
};