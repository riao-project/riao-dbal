import { ColumnOptions, ColumnType } from '../../column';

export const BigIntKeyColumn: ColumnOptions = {
	name: 'id',
	type: ColumnType.BIGINT,
	primaryKey: true,
	autoIncrement: true,
};
