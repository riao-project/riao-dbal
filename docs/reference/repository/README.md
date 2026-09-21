# Building repositories

## Purpose

A repository wraps a table and exposes a small API for reading and writing records.

## Entry point

```ts
import { Database } from '@riao/dbal';

const repo = db.getQueryRepository<User>({ table: 'user' });
```

## Common methods

### find

```ts
const rows = await repo.find({
  table: 'user',
  where: { active: true },
  orderBy: { id: 'ASC' },
  limit: 20,
});
```

### findOne

```ts
const row = await repo.findOne({
  table: 'user',
  where: { id: 42 },
});
```

### findById

```ts
const row = await repo.findById(42);
```

### count

```ts
const total = await repo.count({ table: 'user' });
const distinctUsers = await repo.count(
  { table: 'user' },
  { distinct: true, column: 'id' }
);
const distinctNames = await repo.count(
  { table: 'user' },
  { distinct: true, columns: ['id', 'fname'] }
);
const groups = await repo.count({
  table: 'user',
  groupBy: ['fname'],
});
```

The optional second argument accepts `distinct`, `column`, or `columns`. When `groupBy` is present, the repository counts distinct combinations of the grouped columns.

### insertOne

```ts
await repo.insertOne({
  table: 'user',
  record: { fname: 'Ada', email: 'ada@example.com' },
});
```

### insert

```ts
await repo.insert({
  table: 'user',
  records: [{ fname: 'Ada' }, { fname: 'Grace' }],
});
```

### update

```ts
await repo.update({
  table: 'user',
  set: { active: true },
  where: { id: 1 },
});
```

### delete

```ts
await repo.delete({
  table: 'user',
  where: { id: 1 },
});
```

### set

Set a database connection variable through the repository:

```ts
await repo.set({
  column: 'search_path',
  value: 'public',
});
```

## Notes

- Repository methods resolve the table from the repository instance when available.
- Result rows are returned as plain objects keyed by column names.
- Repository behavior is driven by the database schema when available.
