export enum ConditionTokenType {
	EQUALS,
	LIKE,
	LT,
	LTE,
	GT,
	GTE,
	IN_ARRAY,
	BETWEEN,
	NOT,
}

export interface ConditionToken {
	riao_condition: ConditionTokenType;
	value: any;
}

export interface NotConditionToken extends ConditionToken {
	riao_condition: ConditionTokenType.NOT;
}
