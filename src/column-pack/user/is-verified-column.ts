import { ColumnOptions, ColumnType } from '../../column';

export const IsVerifiedColumn: ColumnOptions = {
	name: 'is_verified',
	type: ColumnType.BOOL,
	default: false,
};