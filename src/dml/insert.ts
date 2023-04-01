export interface InsertOptions {
	table: string;
	records: Record<string, any> | Record<string, any>[];
	ifNotExists?: boolean;
	onDuplicateKeyUpdate?: Record<string, any>;
}
