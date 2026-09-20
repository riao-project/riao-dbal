import { ColumnOptions, ColumnType } from '../../column';

export const CountryCodeColumn: ColumnOptions = {
	name: 'country_code',
	type: ColumnType.VARCHAR,
	length: 2,
	required: false,
};