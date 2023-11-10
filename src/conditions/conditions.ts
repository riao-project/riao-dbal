import {
	ConditionToken,
	ConditionTokenType,
	NotConditionToken,
} from './condition-token';

export class Conditions {
	public static between(a: any, b: any): ConditionToken {
		return {
			riao_condition: ConditionTokenType.BETWEEN,
			value: { a, b },
		};
	}

	public static equals(value: any): ConditionToken {
		return {
			riao_condition: ConditionTokenType.EQUALS,
			value,
		};
	}

	public static gt(value: any): ConditionToken {
		return {
			riao_condition: ConditionTokenType.GT,
			value,
		};
	}

	public static gte(value: any): ConditionToken {
		return {
			riao_condition: ConditionTokenType.GTE,
			value,
		};
	}

	public static inArray(values: any[]): ConditionToken {
		return {
			riao_condition: ConditionTokenType.IN_ARRAY,
			value: values,
		};
	}

	public static like(value: string): ConditionToken {
		return {
			riao_condition: ConditionTokenType.LIKE,
			value,
		};
	}

	public static lt(value: any): ConditionToken {
		return {
			riao_condition: ConditionTokenType.LT,
			value,
		};
	}

	public static lte(value: any): ConditionToken {
		return {
			riao_condition: ConditionTokenType.LTE,
			value,
		};
	}

	public static not(value: any): NotConditionToken {
		return {
			riao_condition: ConditionTokenType.NOT,
			value,
		};
	}

	public static and(): 'and' {
		return 'and';
	}

	public static or(): 'or' {
		return 'or';
	}
}
