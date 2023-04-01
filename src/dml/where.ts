import { ColumnName } from './column-name';

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

export interface WhereConditionGroup extends WhereCondition {
	riao_isGroup?: true;
}

export function not(value: Record<string, any>): WhereConditionGroup;
export function not(value: any): WhereCondition;

export function not(value: any): WhereCondition | WhereConditionGroup {
	const obj = {
		condition: 'not',
		value: value,
	};

	if (typeof value === 'object') {
		return <WhereConditionGroup>{
			riao_isGroup: true,
			...obj,
		};
	}
	else {
		return <WhereCondition>obj;
	}
}

export type WhereKeyVal = {
	[key: string]:
		| undefined
		| null
		| string
		| number
		| boolean
		| WhereCondition
		| ColumnName;
};

export type Where =
	| 'and'
	| 'or'
	| 'null'
	| WhereKeyVal
	| WhereConditionGroup
	| Where[];

export const and = 'and';
export const or = 'or';
