import { ColumnOptions, ColumnType } from '../../column';

export const AltTextColumn: ColumnOptions = {
	name: 'alt_text',
	type: ColumnType.VARCHAR,
	length: 255,
	required: false,
};