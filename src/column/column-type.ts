export enum ColumnType {
	// Numbers
	BOOL = 'BOOL',
	TINYINT = 'TINYINT',
	SMALLINT = 'SMALLINT',
	INT = 'INT',
	BIGINT = 'BIGINT',
	DECIMAL = 'DECIMAL',
	FLOAT = 'FLOAT',
	DOUBLE = 'DOUBLE',

	// Serial
	SMALLSERIAL = 'SMALLSERIAL',
	SERIAL = 'SERIAL',
	BIGSERIAL = 'BIGSERIAL',

	// Dates/Times
	DATE = 'DATE',
	TIME = 'TIME',
	DATETIME = 'DATETIME',

	// Text
	CHAR = 'CHAR',
	VARCHAR = 'VARCHAR',
	TEXT = 'TEXT',

	// Binary
	BLOB = 'BLOB',
}
