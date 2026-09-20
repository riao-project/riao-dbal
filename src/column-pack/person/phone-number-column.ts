import { ColumnOptions, ColumnType } from '../../column';

export const PhoneNumberColumn: ColumnOptions = {
	name: 'phone_number',
	type: ColumnType.VARCHAR,
	length: 32,
	required: false,
};