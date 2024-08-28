import { ColumnOptions, ColumnType } from '../../column';

export const BigIntKeyColumn: ColumnOptions = {
	name: 'id',
	type: ColumnType.INT,
	primaryKey: true,
	autoIncrement: true,
};
