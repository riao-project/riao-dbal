import { Expression } from '../expression';

export interface BaseJoin {
	table: string;
	alias?: string;
}

export interface InnerCrossJoin extends BaseJoin {
	type?: 'INNER' | 'CROSS';
	on?: Expression;
}

export interface LeftRightJoin extends BaseJoin {
	type?: 'LEFT' | 'RIGHT';
	outer?: boolean;
	on: Expression;
}

export type Join = InnerCrossJoin | LeftRightJoin;
