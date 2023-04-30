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
	condition: WhereConditionType;
	value: any;
}

export function equals(value: any): WhereCondition {
	return {
		condition: 'equals',
		value: value,
	};
}

export function like(value: any): WhereCondition {
	return {
		condition: 'like',
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

export function inArray(value: any[]): WhereCondition {
	return {
		condition: 'in',
		value: value,
	};
}

export function columnName(name: string): ColumnName {
	return new ColumnName(name);
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
