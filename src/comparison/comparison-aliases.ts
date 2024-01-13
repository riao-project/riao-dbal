import { ComparisonToken } from './comparison-token';
import { Comparison } from './comparison';

export function between(a: any, b: any): ComparisonToken {
	return Comparison.between(a, b);
}

export function equals(value: any): ComparisonToken {
	return Comparison.equals(value);
}

export function notEqual(value: any): ComparisonToken {
	return Comparison.notEqual(value);
}

export function gt(value: any): ComparisonToken {
	return Comparison.gt(value);
}

export function gte(value: any): ComparisonToken {
	return Comparison.gte(value);
}

export function inArray(value: any[]): ComparisonToken {
	return Comparison.inArray(value);
}

export function like(value: any): ComparisonToken {
	return Comparison.like(value);
}

export function lt(value: any): ComparisonToken {
	return Comparison.lt(value);
}

export function lte(value: any): ComparisonToken {
	return Comparison.lte(value);
}
