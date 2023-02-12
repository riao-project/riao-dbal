import { Where } from './where';

export type SelectColumn = string;

export interface SelectQuery {
	columns?: SelectColumn[];
	from: string;
	where?: Where | Where[];
	limit?: number;
}
