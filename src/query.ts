export interface DatabaseQueryOptions {
	sql: string;
	params?: Record<string, any>;
}

export interface DatabaseQueryResult {
	results?: Record<string, any>[];
}
