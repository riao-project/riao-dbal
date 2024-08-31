import { ColumnOptions, ColumnType } from '../../column';

export const IntKeyColumn: ColumnOptions = {
	name: 'id',
	type: ColumnType.INT,
	primaryKey: true,
	autoIncrement: true,
};
