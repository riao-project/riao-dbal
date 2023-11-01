import { ConditionToken, NotConditionToken } from './condition-token';
import { Conditions } from './conditions';

export function between(a: any, b: any): ConditionToken {
	return Conditions.between(a, b);
}

export function equals(value: any): ConditionToken {
	return Conditions.equals(value);
}

export function gt(value: any): ConditionToken {
	return Conditions.gt(value);
}

export function gte(value: any): ConditionToken {
	return Conditions.gte(value);
}

export function inArray(value: any[]): ConditionToken {
	return Conditions.inArray(value);
}

export function like(value: any): ConditionToken {
	return Conditions.like(value);
}

export function lt(value: any): ConditionToken {
	return Conditions.lt(value);
}

export function lte(value: any): ConditionToken {
	return Conditions.lte(value);
}

export function not(value: any): NotConditionToken {
	return Conditions.not(value);
}

export const and = 'and';
export const or = 'or';
