# Creating columns

## Purpose

Column definitions describe a database field’s type, constraints, default values, and identity.

## Basic shape

```ts
import { ColumnType, DataDefinitionBuilder } from '@riao/dbal';

const { sql } = new DataDefinitionBuilder()
  .createTable({
    name: 'user',
    columns: [
      {
        name: 'email',
        type: ColumnType.VARCHAR,
        length: 255,
        required: true,
        isUnique: true,
      },
    ],
  })
  .toDatabaseQuery();
```

Column definitions are `ColumnOptions` objects passed in the `columns` array
of `createTable()` or the column lists accepted by other DDL operations.

## Common properties

### `name`

The database column name as a string.

```ts
const email = { name: 'email', type: ColumnType.VARCHAR, length: 255 };
```

### `type`

A required `ColumnType` enum value. The type controls which other options and
default values are valid. See [Column types](#column-types) below.

```ts
const count = { name: 'count', type: ColumnType.INT };
```

### `length`

The numeric length for a `VARCHAR` column. It is not available on `CHAR`,
`TEXT`, or `BLOB` column options.

```ts
const username = {
  name: 'username',
  type: ColumnType.VARCHAR,
  length: 100,
};
```

### `required`

When `true`, emits `NOT NULL` for the column. The default is nullable when the
property is omitted.

```ts
const email = {
  name: 'email',
  type: ColumnType.VARCHAR,
  length: 255,
  required: true,
};
```

### `default`

Sets the database default. Values are checked by column type and may include
`null`, primitive values, `Date`, `Buffer`, strings, or database function
tokens where supported.

Strings are emitted as quoted string values. Use a database function token for
an SQL expression such as the current timestamp:

```ts
const createdAt = {
  name: 'created_at',
  type: ColumnType.TIMESTAMP,
  default: DatabaseFunctions.currentTimestamp(),
};
```

### `primaryKey`

When `true`, includes the column in the table’s primary-key constraint. Set it
on multiple columns to create a composite primary key.

```ts
const id = { name: 'id', type: ColumnType.INT, primaryKey: true };
```

### `autoIncrement`

When `true`, emits `AUTO_INCREMENT` for an integer column. It is available on
`TINYINT`, `SMALLINT`, `INT`, and `BIGINT` columns.

```ts
const id = {
  name: 'id',
  type: ColumnType.BIGINT,
  primaryKey: true,
  autoIncrement: true,
};
```

### `isUnique`

When `true`, adds a unique constraint for the column. The property is named
`isUnique`, not `unique`.

```ts
const email = {
  name: 'email',
  type: ColumnType.VARCHAR,
  length: 255,
  isUnique: true,
};
```

### `fk`

Adds an inline foreign-key reference. Set `referencesTable` and
`referencesColumn`; optionally provide a constraint `name`, `onUpdate`, or
`onDelete`. Actions are `RESTRICT`, `CASCADE`, or `SET NULL`.

```ts
const authorId = {
  name: 'author_id',
  type: ColumnType.INT,
  fk: {
    referencesTable: 'user',
    referencesColumn: 'id',
    onDelete: 'CASCADE',
  },
};
```

### `triggers`

A function that receives the table name, column name, and ID-column name and
returns database triggers for the column. The triggers are included when the
table is created.

```ts
import { UpdateTimestampTrigger } from '@riao/dbal';

const updatedAt = {
  name: 'updated_at',
  type: ColumnType.TIMESTAMP,
  triggers: ({ table, column, idColumn }) => [
    new UpdateTimestampTrigger({ table, column, idColumn }),
  ],
};
```

## Column types

### `ColumnType.UUID`

Stores a UUID string. No type-specific options are required.

```ts
const id = { name: 'id', type: ColumnType.UUID, primaryKey: true };
```

### `ColumnType.BOOL`

Stores a boolean value. Boolean defaults can be `true`, `false`, or `null`.

```ts
const active = { name: 'active', type: ColumnType.BOOL, default: true };
```

### `ColumnType.TINYINT`

Stores a small integer. Integer columns can set `autoIncrement`.

```ts
const value = { name: 'value', type: ColumnType.TINYINT };
```

### `ColumnType.SMALLINT`

Stores a small integer with a larger range than `TINYINT`.

```ts
const sortOrder = { name: 'sort_order', type: ColumnType.SMALLINT };
```

### `ColumnType.INT`

Stores a standard integer and supports `autoIncrement`.

```ts
const id = {
  name: 'id',
  type: ColumnType.INT,
  primaryKey: true,
  autoIncrement: true,
};
```

### `ColumnType.BIGINT`

Stores a large integer and supports `autoIncrement`.

```ts
const id = { name: 'id', type: ColumnType.BIGINT, autoIncrement: true };
```

### `ColumnType.DECIMAL`

Stores a fixed-precision decimal. `significant` is the number of digits before the decimal point
and `decimal` is the number of digits after the decimal point.


```ts
const priceColumn = {
  name: 'price',
  type: ColumnType.DECIMAL,
  significant: 10,
  decimal: 2,
};
```

### `ColumnType.FLOAT`

Stores a floating-point number. No type-specific options are required.

```ts
const ratio = { name: 'ratio', type: ColumnType.FLOAT };
```

### `ColumnType.DOUBLE`

Stores a double-precision floating-point number.

```ts
const measurement = { name: 'measurement', type: ColumnType.DOUBLE };
```

### `ColumnType.DATE`

Stores a calendar date. Defaults can be `Date`, string, `null`, or a matching
database function token.

```ts
const birthday = { name: 'birthday', type: ColumnType.DATE };
```

### `ColumnType.TIME`

Stores a time value. Defaults can be `Date`, string, `null`, or a matching
database function token.

```ts
const openingTime = { name: 'opening_time', type: ColumnType.TIME };
```

### `ColumnType.TIMESTAMP`

Stores a timestamp. Use `DatabaseFunctions.currentTimestamp()` for a database
generated current timestamp default.

```ts
const createdAt = {
  name: 'created_at',
  type: ColumnType.TIMESTAMP,
  default: DatabaseFunctions.currentTimestamp(),
};
```

### `ColumnType.CHAR`

Stores a character string. No type-specific options are required.

```ts
const code = { name: 'code', type: ColumnType.CHAR };
```

### `ColumnType.VARCHAR`

Stores a variable-length string. `length` is required.

```ts
const email = {
  name: 'email',
  type: ColumnType.VARCHAR,
  length: 255,
};
```

### `ColumnType.TEXT`

Stores a text string without a length option.

```ts
const description = { name: 'description', type: ColumnType.TEXT };
```

### `ColumnType.BLOB`

Stores binary data as a `Buffer` or string. No type-specific options are
required.

```ts
const payload = { name: 'payload', type: ColumnType.BLOB };
```

## Example: timestamp with default

```ts
import { ColumnType, DatabaseFunctions } from '@riao/dbal';

const createdAt = {
  name: 'created_at',
  type: ColumnType.TIMESTAMP,
  required: true,
  default: DatabaseFunctions.currentTimestamp(),
};
```

String defaults are treated as string values and are quoted in generated SQL.
Use a database function token when the default is a database expression.

## Reusable templates

Use `createColumnTemplate()` when several columns share defaults:

```ts
import { ColumnType, createColumnTemplate } from '@riao/dbal';

const foreignKey = createColumnTemplate({
  name: 'user_id',
  type: ColumnType.INT,
  required: true,
  fk: {
    referencesTable: 'user',
    referencesColumn: 'id',
    onDelete: 'CASCADE',
  },
});

const authorId = foreignKey({ name: 'author_id' });
const editorId = foreignKey({ name: 'editor_id' });
```

Templates clone their defaults, deep-merge nested objects, and replace arrays.

## Notes

- Column config is the schema format consumed by `createTable()`.
- The project also provides reusable pack definitions for common fields.
- The `column` package is meant to keep schema definitions explicit and reusable.
