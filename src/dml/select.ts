import { OrderBy } from './order-by';
import { Where } from './where';

export type SelectColumn = string;

export interface SelectQuery {
	columns?: SelectColumn[];
	table: string;
	where?: Where | Where[];
	limit?: number;
	orderBy?: OrderBy;
}
