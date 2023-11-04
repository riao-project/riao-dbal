export function isCondition(value: any): boolean {
	return typeof value === 'object' && 'riao_condition' in value;
}
