export interface DatabaseQueryOptions {
	sql: string;
	params?: any[];
}

export interface DatabaseQueryResult {
	results?: Record<string, any>[];
}
