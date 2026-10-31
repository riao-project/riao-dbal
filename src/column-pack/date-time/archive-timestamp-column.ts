import { ColumnOptions, ColumnType } from '../../column';

export const ArchiveTimestampColumn: ColumnOptions = {
	name: 'archived_at',
	type: ColumnType.TIMESTAMP,
	required: false,
};