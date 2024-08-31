import { ColumnOptions } from '../../column';
import { EmailColumn } from './email-column';

export const TempEmailColumn: ColumnOptions = {
	...EmailColumn,
	name: 'temp_email',
	required: false,
};
