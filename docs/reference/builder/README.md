# Building queries

## Purpose

The query builder composes SQL fragments into a database query object.

These methods build SQL; they do not execute it. Each call to `toDatabaseQuery()` returns an object containing the SQL and its parameters.

## Entry point

```ts
import { DatabaseQueryBuilder } from '@riao/dbal';

const qb = new DatabaseQueryBuilder();
```

## Core methods

### select

```ts
const { sql, params } = qb
  .select({
    table: 'user',
    columns: ['id', 'fname'],
    where: { id: 1 },
    orderBy: { id: 'ASC' },
    limit: 10,
  })
  .toDatabaseQuery();
```

Generated SQL follows the project convention:

```sql
SELECT "id", "fname" FROM "user" WHERE ("id" = ?) ORDER BY "id" ASC LIMIT 10
```

`select` also supports:

- `columns`, including column aliases and expression columns
- `distinct` and `tableAlias`
- `join`
- `groupBy` and `having`
- `offset`
- `union`, `intersect`, and `except`

For reusable or more complex expressions, the builder supports comparison tokens, logical expressions, database functions, raw expressions, case expressions, and subqueries.

### where

`where` is normally supplied as part of a statement:

```ts
const { sql, params } = qb
  .select({
    table: 'user',
    where: { active: true },
  })
  .toDatabaseQuery();
```

### orderBy

```ts
const { sql, params } = qb
  .select({
    table: 'user',
    orderBy: { created_at: 'DESC' },
  })
  .toDatabaseQuery();
```

### insert

```ts
qb.insert({
  table: 'user',
  records: [{ id: 1, fname: 'Ada' }],
}).toDatabaseQuery();
```

`insert` accepts one record or an array of records. It also supports `onDuplicateKeyUpdate` and `primaryKey`.

### update

```ts
qb.update({
  table: 'user',
  set: { fname: 'Ada' },
  where: { id: 1 },
}).toDatabaseQuery();
```

`update` supports joins and an optional `from` source in addition to `set` and `where`.

### delete

```ts
qb.delete({
  table: 'user',
  where: { id: 1 },
}).toDatabaseQuery();
```

`delete` supports joins and a required `where` expression.

## Notes

- Query builders return `{ sql, params }` via `toDatabaseQuery()`.
- Values are parameterized using placeholders.
- Builders are useful when you need control over SQL composition beyond repository shortcuts.
