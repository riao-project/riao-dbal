import { ColumnOptions } from '../../column/column-options';
import { ColumnType } from '../../column/column-type';

export const FilenameColumn: ColumnOptions = {
	name: 'filename',
	type: ColumnType.VARCHAR,
	length: 255,
};
