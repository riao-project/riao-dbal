/**
 * Check if a value is a database function token
 *
 * @param fn Value to check
 * @returns Returns true if the value is a database function
 */
export function isDatabaseFunction(fn: any): boolean {
	return typeof fn === 'object' && 'riao_dbfn' in fn;
}
