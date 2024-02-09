import { Expression } from '../expression';

export interface Join {
	type?: 'LEFT' | 'RIGHT' | 'INNER' | 'CROSS';
	table: string;
	alias?: string;
	on?: Expression;
}
