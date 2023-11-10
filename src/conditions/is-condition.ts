export function isCondition(value: any): boolean {
	return value && typeof value === 'object' && 'riao_condition' in value;
}
