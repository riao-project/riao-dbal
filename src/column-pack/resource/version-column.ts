import { ColumnOptions, ColumnType } from '../../column';

export const VersionColumn: ColumnOptions = {
	name: 'version',
	type: ColumnType.INT,
	default: 1,
};