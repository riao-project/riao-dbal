import { ColumnName } from './column-name';

export type WhereConditionType =
	| 'equals'
	| 'like'
	| 'lt'
	| 'lte'
	| 'gt'
	| 'gte'
	| 'in'
	| 'not';

export interface WhereCondition {
	riao_condition: WhereConditionType;
	value: any;
}

export function equals(value: any): WhereCondition {
	return {
		riao_condition: 'equals',
		value: value,
	};
}

export function like(value: any): WhereCondition {
	return {
		riao_condition: 'like',
		value: value,
	};
}

export function lt(value: any): WhereCondition {
	return {
		riao_condition: 'lt',
		value: value,
	};
}

export function lte(value: any): WhereCondition {
	return {
		riao_condition: 'lte',
		value: value,
	};
}

export function gt(value: any): WhereCondition {
	return {
		riao_condition: 'gt',
		value: value,
	};
}

export function gte(value: any): WhereCondition {
	return {
		riao_condition: 'gte',
		value: value,
	};
}

export function inArray(value: any[]): WhereCondition {
	return {
		riao_condition: 'in',
		value: value,
	};
}

export function columnName(name: string): ColumnName {
	return new ColumnName(name);
}

export interface NotWhereCondition extends WhereCondition {
	riao_condition: 'not';
}

export function not(value: any): NotWhereCondition {
	return {
		riao_condition: 'not',
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
		| WhereCondition
		| ColumnName;
};

export type Where =
	| 'and'
	| 'or'
	| 'null'
	| WhereKeyVal
	| NotWhereCondition
	| Where[];

export const and = 'and';
export const or = 'or';
