/**
 * Type for a uuid property
 */
export type UUIDValue = string;

/**
 * Type for a boolean property
 */
export type BoolValue = boolean;

/**
 * Type for a integer property
 */
export type IntegerValue = number | bigint;

/**
 * Type for a decimal/float property
 */
export type DecimalValue = number;

/**
 * Type for a date/time property
 */
export type DateValue = Date;

/**
 * Type for a text property
 */
export type TextValue = string;

/**
 * Type for a blob property
 */
export type BlobValue = string | Buffer;

/**
 * Type for a property
 */
export type ColumnValue =
	| BoolValue
	| IntegerValue
	| DecimalValue
	| DateValue
	| TextValue
	| BlobValue;
