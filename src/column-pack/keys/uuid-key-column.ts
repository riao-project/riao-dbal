import { ColumnOptions, ColumnType } from '../../column';
import { DatabaseFunctions } from '../../functions';

export const UUIDKeyColumn: ColumnOptions = {
	name: 'id',
	type: ColumnType.UUID,
	primaryKey: true,
	default: DatabaseFunctions.uuid(),
};
