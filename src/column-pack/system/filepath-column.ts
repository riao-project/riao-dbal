import { ColumnOptions } from '../../column/column-options';
import { ColumnType } from '../../column/column-type';

export const FilepathColumn: ColumnOptions = {
	name: 'filepath',
	type: ColumnType.VARCHAR,
	length: 4096,
};
