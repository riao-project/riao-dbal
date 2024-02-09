export enum ColumnType {
	// ID
	UUID = 'UUID',

	// Numbers
	BOOL = 'BOOL',
	TINYINT = 'TINYINT',
	SMALLINT = 'SMALLINT',
	INT = 'INT',
	BIGINT = 'BIGINT',
	DECIMAL = 'DECIMAL',
	FLOAT = 'FLOAT',
	DOUBLE = 'DOUBLE',

	// Dates/Times
	DATE = 'DATE',
	TIME = 'TIME',
	TIMESTAMP = 'TIMESTAMP',

	// Text
	CHAR = 'CHAR',
	VARCHAR = 'VARCHAR',
	TEXT = 'TEXT',

	// Binary
	BLOB = 'BLOB',
}
