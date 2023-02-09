export type WhereConditionType = 'equals' | 'lt' | 'lte' | 'gt' | 'gte' | 'not';

export interface WhereCondition {
	condition: WhereConditionType;
	value: any;
}

export function equals(value: any): WhereCondition {
	return {
		condition: 'equals',
		value: value,
	};
}

export function lt(value: any): WhereCondition {
	return {
		condition: 'lt',
		value: value,
	};
}

export function lte(value: any): WhereCondition {
	return {
		condition: 'lte',
		value: value,
	};
}

export function gt(value: any): WhereCondition {
	return {
		condition: 'gt',
		value: value,
	};
}

export function gte(value: any): WhereCondition {
	return {
		condition: 'gte',
		value: value,
	};
}

export function not(value: any): WhereCondition {
	return {
		condition: 'not',
		value: value,
	};
}

export type WhereKeyVal = {
	[key: string]:
		| undefined
		| null
		| string
		| number
		| boolean
		| WhereCondition;
};

export type Where = 'and' | 'or' | 'null' | WhereKeyVal | Where[];

export const and = 'and';
export const or = 'or';
