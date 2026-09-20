import { ColumnOptions, ColumnType } from '../../column';

export const ChecksumColumn: ColumnOptions = {
	name: 'checksum',
	type: ColumnType.VARCHAR,
	length: 128,
	required: false,
};