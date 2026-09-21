# Using database functions

## Purpose

Database functions let you express common database-side computations inside query-building code.

## Entry point

```ts
import { columnName, DatabaseFunctions } from '@riao/dbal';
```

## Common functions

- `DatabaseFunctions.count()`
- `DatabaseFunctions.sum(expr)`
- `DatabaseFunctions.average(expr)`
- `DatabaseFunctions.min(expr)`
- `DatabaseFunctions.max(expr)`
- `DatabaseFunctions.round(expr, decimals)`
- `DatabaseFunctions.currentTimestamp()`
- `DatabaseFunctions.date(expr)`
- `DatabaseFunctions.day(expr)`
- `DatabaseFunctions.month(expr)`
- `DatabaseFunctions.year(expr)`
- `DatabaseFunctions.concat(...expr)`
- `DatabaseFunctions.uuid()`

## Function reference

### `count(params)`

Counts records by default. Pass `column`, `columns`, or `expr` to count a specific value, and set `distinct: true` to count distinct values.

```ts
const total = DatabaseFunctions.count();
const uniqueUsers = DatabaseFunctions.count({
  distinct: true,
  column: 'user_id',
});
```

### `sum(expr, options)`

Returns the sum of a numeric expression. Set `distinct: true` to sum only distinct values.

```ts
const totalAmount = DatabaseFunctions.sum(columnName('amount'));
const uniqueAmountTotal = DatabaseFunctions.sum(columnName('amount'), {
  distinct: true,
});
```

### `average(expr, options)`

Returns the average of a numeric expression. Set `distinct: true` to average only distinct values.

```ts
const averageScore = DatabaseFunctions.average(columnName('score'));
```

### `min(expr)`

Returns the minimum value of an expression.

```ts
const earliestScore = DatabaseFunctions.min(columnName('score'));
```

### `max(expr)`

Returns the maximum value of an expression.

```ts
const latestScore = DatabaseFunctions.max(columnName('score'));
```

### `round(expr, decimals)`

Rounds a numeric expression. The optional `decimals` argument controls the number of decimal places.

```ts
const roundedScore = DatabaseFunctions.round(columnName('score'), 2);
```

### `currentTimestamp()`

Returns the current timestamp from the database.

```ts
const now = DatabaseFunctions.currentTimestamp();
```

### `date(expr)`

Returns the date portion of an expression. When omitted, the database’s current date is used.

```ts
const createdDate = DatabaseFunctions.date(columnName('created_at'));
```

### `day(expr)`

Returns the day of the month from an expression. When omitted, the current date is used.

```ts
const createdDay = DatabaseFunctions.day(columnName('created_at'));
```

### `month(expr)`

Returns the month from an expression. When omitted, the current date is used.

```ts
const createdMonth = DatabaseFunctions.month(columnName('created_at'));
```

### `year(expr)`

Returns the year from an expression. When omitted, the current date is used.

```ts
const createdYear = DatabaseFunctions.year(columnName('created_at'));
```

### `concat(...expr)`

Combines expressions into a string.

```ts
const displayName = DatabaseFunctions.concat(
  columnName('first_name'),
  ' ',
  columnName('last_name')
);
```

### `uuid()`

Generates a database UUID value.

```ts
const id = DatabaseFunctions.uuid();
```

## Example

```ts
const { sql } = new DatabaseQueryBuilder()
  .select({
    columns: [{ query: DatabaseFunctions.count(), as: 'count' }],
  })
  .toDatabaseQuery();
```

This generates SQL equivalent to:

```sql
SELECT COUNT(*) AS "count"
```

## Notes

- These functions are meant to remain portable across database targets.
- They are especially useful in aggregations and timestamp expressions.
- Function tokens are consumed as expression values in the query builder.
