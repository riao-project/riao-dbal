import { Where } from './where';

export interface BaseJoin {
	table: string;
	alias?: string;
}

export interface InnerCrossJoin extends BaseJoin {
	type?: 'INNER' | 'CROSS';
	on?: Where;
}

export interface LeftRightJoin extends BaseJoin {
	type?: 'LEFT' | 'RIGHT';
	outer?: boolean;
	on: Where;
}

export type Join = InnerCrossJoin | LeftRightJoin;
