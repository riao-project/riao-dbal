import { OrderBy } from './order-by';
import { Where } from './where';

export type SelectColumn = string;

export interface SelectQuery {
	columns?: SelectColumn[];
	from: string;
	where?: Where | Where[];
	limit?: number;
	orderBy?: OrderBy;
}
