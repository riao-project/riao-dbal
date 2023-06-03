/**
 * Type for a boolean property
 */
export type BoolValue = boolean;

/**
 * Type for a integer property
 */
export type IntegerValue = number;

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
 * Type for a binary property
 */
export type BinaryValue = string;

/**
 * Type for a blob property
 */
export type BlobValue = string;

/**
 * Type for an enum property
 */
export type EnumValue<T = string> = T;

/**
 * Type for a property
 */
export type ColumnValue =
	| BoolValue
	| IntegerValue
	| DecimalValue
	| DateValue
	| TextValue
	| BinaryValue
	| BlobValue
	| EnumValue;
