export interface ColumnNameToken {
	riao_column: string;
}

export function columnName(name: string): ColumnNameToken {
	return { riao_column: name };
}
