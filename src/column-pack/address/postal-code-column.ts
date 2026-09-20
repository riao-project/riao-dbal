import { ColumnOptions, ColumnType } from '../../column';

export const PostalCodeColumn: ColumnOptions = {
	name: 'postal_code',
	type: ColumnType.VARCHAR,
	length: 20,
	required: false,
};