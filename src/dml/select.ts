import { Join } from './join';
import { OrderBy } from './order-by';
import { Where } from './where';

export type SelectColumn = string;

export interface SelectQuery {
	columns?: SelectColumn[];
	table: string;
	join?: Join[];
	where?: Where | Where[];
	limit?: number;
	orderBy?: OrderBy;
}
