import { ColumnOptions, ColumnType } from '../../column';

export const MimeTypeColumn: ColumnOptions = {
	name: 'mime_type',
	type: ColumnType.VARCHAR,
	length: 255,
	required: false,
};