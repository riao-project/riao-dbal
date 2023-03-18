import { ColumnType } from './column-type';
import * as DataTypes from './column-values';

/**
 * Base interface for column options
 */
export interface BaseColumnOptions {
	name: string;
	type: ColumnType;
	default?: string | DataTypes.ColumnValue;
	primaryKey?: boolean;
}

// -----------------------------------------------------------------------------
// Boolean type
// -----------------------------------------------------------------------------

/**
 * Bool column options
 */
export interface BoolColumnOptions extends BaseColumnOptions {
	default?: DataTypes.BoolValue;
	type: ColumnType.BOOL;
}

// -----------------------------------------------------------------------------
// Bit types
// -----------------------------------------------------------------------------

/**
 * Single bit column options
 */
export interface SingleBitColumnOptions extends BaseColumnOptions {
	default?: DataTypes.SingleBitValue;
	type: ColumnType.BIT;
}

/**
 * Multi bit column options
 */
export interface MultiBitColumnOptions extends BaseColumnOptions {
	default?: DataTypes.MultiBitValue;
	length?: number;
	type: ColumnType.BIT;
}

/**
 * Single/multi bit column options
 */
export type BitColumnOptions = SingleBitColumnOptions | MultiBitColumnOptions;

// -----------------------------------------------------------------------------
// Integer types
// -----------------------------------------------------------------------------

/**
 * Base class for integer column options
 */
export interface BaseIntColumnOptions extends BaseColumnOptions {
	default?: DataTypes.IntegerValue;
	autoIncrement?: boolean;
}

/**
 * Tiny int column options
 */
export interface TinyIntColumnOptions extends BaseIntColumnOptions {
	type: ColumnType.TINYINT;
}

/**
 * Small int column options
 */
export interface SmallIntColumnOptions extends BaseIntColumnOptions {
	type: ColumnType.SMALLINT;
}

/**
 * Int column options
 */
export interface IntColumnOptions extends BaseIntColumnOptions {
	type: ColumnType.INT;
}

/**
 * Big int column options
 */
export interface BigIntColumnOptions extends BaseIntColumnOptions {
	type: ColumnType.BIGINT;
}

// -----------------------------------------------------------------------------
// Decimal & Floating types
// -----------------------------------------------------------------------------

/**
 * Base interface for decimal types
 */
export interface BaseDecimalColumnOptions extends BaseColumnOptions {
	default?: DataTypes.DecimalValue;
}

/**
 * Decimal column options
 */
export interface DecimalColumnOptions extends BaseDecimalColumnOptions {
	significant: number;
	decimal: number;
	type: ColumnType.DECIMAL;
}

/**
 * Float column options
 */
export interface FloatColumnOptions extends BaseDecimalColumnOptions {
	type: ColumnType.FLOAT;
}

/**
 * Double column options
 */
export interface DoubleColumnOptions extends BaseDecimalColumnOptions {
	type: ColumnType.DOUBLE;
}

/**
 * Small money column options
 */
export interface SmallMoneyColumnOptions extends BaseDecimalColumnOptions {
	type: ColumnType.SMALLMONEY;
}

/**
 * Money column options
 */
export interface MoneyColumnOptions extends BaseDecimalColumnOptions {
	type: ColumnType.MONEY;
}

// -----------------------------------------------------------------------------
// Date & Time types
// -----------------------------------------------------------------------------
export type DateDefaultValues = string | DataTypes.DateValue;

/**
 * Date column options
 */
export interface DateColumnOptions extends BaseColumnOptions {
	default?: DateDefaultValues;
	type: ColumnType.DATE;
}

/**
 * Time column options
 */
export interface TimeColumnOptions extends BaseColumnOptions {
	default?: DateDefaultValues;
	type: ColumnType.TIME;
}

/**
 * DateTime column options
 */
export interface DateTimeColumnOptions extends BaseColumnOptions {
	default?: DateDefaultValues;
	type: ColumnType.DATETIME;
}

/**
 * Timestamp column options
 */
export interface TimestampColumnOptions extends BaseColumnOptions {
	default?: DateDefaultValues;
	type: ColumnType.TIMESTAMP;
}

/**
 * Year column options
 */
export interface YearColumnOptions extends BaseColumnOptions {
	default?: DataTypes.IntegerValue;
	type: ColumnType.YEAR;
}

// -----------------------------------------------------------------------------
// Text types
// -----------------------------------------------------------------------------

/**
 * Base interface for text column options
 */
export interface BaseTextColumnOptions extends BaseColumnOptions {
	default?: DataTypes.TextValue;
}

/**
 * Char column options
 */
export interface CharColumnOptions extends BaseTextColumnOptions {
	type: ColumnType.CHAR;
}

/**
 * VarChar column options
 */
export interface VarCharColumnOptions extends BaseTextColumnOptions {
	length: number;
	type: ColumnType.VARCHAR;
}

/**
 * Tiny text column options
 */
export interface TinyTextColumnOptions extends BaseTextColumnOptions {
	type: ColumnType.TINYTEXT;
}

/**
 * Text column options
 */
export interface TextColumOptions extends BaseTextColumnOptions {
	type: ColumnType.TEXT;
}

/**
 * Medium text column options
 */
export interface MediumTextColumnOptions extends BaseTextColumnOptions {
	type: ColumnType.MEDIUMTEXT;
}

/**
 * Long text column options
 */
export interface LongTextColumnOptions extends BaseTextColumnOptions {
	type: ColumnType.LONGTEXT;
}

// -----------------------------------------------------------------------------
// Binary types
// -----------------------------------------------------------------------------

/**
 * Base interface for binary column options
 */
export interface BaseBinaryColumnOptions extends BaseColumnOptions {
	default?: DataTypes.BinaryValue;
}

/**
 * Binary column options
 */
export interface BinaryColumnOptions extends BaseBinaryColumnOptions {
	type: ColumnType.BINARY;
}

/**
 * VarBinary column options
 */
export interface VarBinaryColumnOptions extends BaseBinaryColumnOptions {
	length: number;
	type: ColumnType.VARBINARY;
}

// -----------------------------------------------------------------------------
// Blob types
// -----------------------------------------------------------------------------

/**
 * Base interface for blob column options
 */
export interface BaseBlobColumnOptions extends BaseColumnOptions {
	default?: DataTypes.BlobValue;
}

/**
 * Tiny blob column options
 */
export interface TinyBlobColumnOptions extends BaseBlobColumnOptions {
	type: ColumnType.TINYBLOB;
}

/**
 * Blob column options
 */
export interface BlobColumnOptions extends BaseBlobColumnOptions {
	type: ColumnType.BLOB;
}

/**
 * Medium blob column options
 */
export interface MediumBlobColumnOptions extends BaseBlobColumnOptions {
	type: ColumnType.MEDIUMBLOB;
}

// -----------------------------------------------------------------------------
// Enum & Set types
// -----------------------------------------------------------------------------

/**
 * Base interface for enum column options
 */
export interface BaseEnumColumnOptions extends BaseColumnOptions {
	enum: string[];
}

/**
 * Enum column options
 */
export interface EnumColumnOptions extends BaseEnumColumnOptions {
	default?: string;
	type: ColumnType.ENUM;
}

/**
 * Set column options
 */
export interface SetColumnOptions extends BaseEnumColumnOptions {
	default?: string[];
	type: ColumnType.SET;
}

/**
 * Column options
 */
export type ColumnOptions =
	| BoolColumnOptions
	| BitColumnOptions
	| TinyIntColumnOptions
	| SmallIntColumnOptions
	| IntColumnOptions
	| BigIntColumnOptions
	| DecimalColumnOptions
	| FloatColumnOptions
	| DoubleColumnOptions
	| SmallMoneyColumnOptions
	| MoneyColumnOptions
	| DateColumnOptions
	| TimeColumnOptions
	| DateTimeColumnOptions
	| TimestampColumnOptions
	| YearColumnOptions
	| CharColumnOptions
	| VarCharColumnOptions
	| TinyTextColumnOptions
	| TextColumOptions
	| MediumTextColumnOptions
	| LongTextColumnOptions
	| BinaryColumnOptions
	| VarBinaryColumnOptions
	| TinyBlobColumnOptions
	| BlobColumnOptions
	| MediumBlobColumnOptions
	| LongTextColumnOptions
	| BlobColumnOptions
	| MediumBlobColumnOptions
	| EnumColumnOptions
	| SetColumnOptions;
