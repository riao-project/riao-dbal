import { ColumnOptions, ColumnType } from '../../column';

export const StorageKeyColumn: ColumnOptions = {
	name: 'storage_key',
	type: ColumnType.VARCHAR,
	length: 512,
	isUnique: true,
	required: true,
};