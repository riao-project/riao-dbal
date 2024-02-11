import { Expression } from '../expression';

export interface CaseCondition {
	when: Expression;
	then: Expression;
}

export interface CaseExpressionInterface {
	value?: Expression;
	case: CaseCondition[];
	else?: Expression;
}

export class CaseExpression implements CaseExpressionInterface {
	value?: Expression;
	case: CaseCondition[];
	else?: Expression;

	public constructor(expr: CaseExpressionInterface) {
		this.value = expr.value;
		this.case = expr.case;
		this.else = expr.else;
	}
}
