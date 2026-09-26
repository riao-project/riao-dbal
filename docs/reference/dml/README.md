# Reading and writing data

## Purpose

The DML layer handles row-level operations: selecting, inserting, updating, and deleting records.

## Repository-level usage

```ts
const repo = db.getQueryRepository<User>({ table: 'user' });

const rows = await repo.find({
  table: 'user',
  where: { id: 1 },
});

await repo.insertOne({
  table: 'user',
  record: { fname: 'Ada' },
  ignoreReturnId: true,
});
```

## Query-builder-level usage

```ts
const { sql, params } = new DatabaseQueryBuilder()
  .select({
    table: 'user',
    where: { active: true },
  })
  .toDatabaseQuery();
```

## Supported operations

### Select

```ts
repo.find({ table: 'user' });
repo.findOne({ table: 'user', where: { id: 1 } });
repo.findById(1);
repo.find({
  table: 'user',
  distinct: true,
  columns: ['fname'],
});
repo.find({
  table: { u: 'user' },
  columns: ['fname'],
  where: { 'u.id': 1 },
});
repo.find({
  table: 'user',
  where: { active: true },
  orderBy: { id: 'DESC' },
  limit: 10,
  offset: 20,
});
```

`table` can be an aliased `From` object, and `distinct` applies to the selected rows. Use `join` for joined queries, `having` with `groupBy`, and `tableAlias` for a table alias. Select queries also support `union`, `intersect`, and `except`.

`findOne` returns `null` when no row matches. `findOneOrFail` throws instead. `findById` uses the repository's configured or schema-discovered primary key and also returns `null` when no row matches.

### Insert

```ts
repo.insertOne({ table: 'user', record: { id: 1 } });
repo.insert({ table: 'user', records: [{ id: 1 }, { id: 2 }] });
repo.insert({
  table: 'user',
  records: [{ id: 1 }],
  ifNotExists: true,
});
repo.insert({
  table: 'user',
  records: [{ id: 1, fname: 'Ada' }],
  onDuplicateKeyUpdate: { fname: 'Ada' },
});
```

When records have different shapes, missing columns are emitted as `NULL` parameters so every row uses the same insert column list. Explicit `null` values are also passed as parameters. `insertOne` returns the inserted row when a primary key is configured or passed as `primaryKey`; use `ignoreReturnId: true` when no returned ID is needed.

### Update

```ts
repo.update({
  table: 'user',
  set: { fname: 'Ada' },
  where: { id: 1 },
});
```

An update can include a `from` source for conditions involving another table:

```ts
repo.update({
  table: 'user',
  set: { fname: 'Ada' },
  from: 'other',
  where: { 'other.id': 1 },
});
```

Updates also accept `join`. The `where` condition is optional, so omit it only when updating every row is intended.

### Atomic arithmetic operations

Atomically increment or decrement numeric columns without requiring a read-modify-write operation:

```ts
// Increment by 1
await repo.increment({
  column: 'views',
  table: 'posts',
  where: { id: 10 },
});

// Increment by a specific value
await repo.increment({
  column: 'score',
  value: 5,
  table: 'game_scores',
  where: { player_id: 123 },
});

// Decrement by 1
await repo.decrement({
  column: 'stock',
  table: 'inventory',
  where: { id: 42 },
});

// Decrement by a specific value
await repo.decrement({
  column: 'health',
  value: 10,
  table: 'game_characters',
  where: { character_id: 999 },
});

// Generic arithmetic operation with any math operator
await repo.updateCalc({
  column: 'counter',
  value: 2,
  op: divide,  // or: plus, minus, times, modulo
  table: 'stats',
  where: { user_id: 5 },
});
```

### Grouping and counting

```ts
repo.find({
  table: 'user',
  columns: ['fname'],
  groupBy: ['fname'],
});

repo.count({ table: 'user', groupBy: ['fname'] });

repo.count({ table: 'user' }, { column: 'id' });
repo.count({ table: 'user' }, { distinct: true, columns: ['fname'] });
```

Grouping is also available through the query builder. Repository `count` uses the grouped columns to count distinct combinations. Without `groupBy`, `count` accepts the same count options as the database function: `column`, `columns`, `expr`, and `distinct`.

### NULL conditions

```ts
repo.find({
  table: 'user',
  where: { deleted_at: null },
});
```

`null` is rendered as an `IS NULL` condition rather than a placeholder comparison.

### Delete

```ts
repo.delete({
  table: 'user',
  where: { id: 1 },
});
```

Delete also accepts `join`; `where` is required.

## Notes

- Use Query Builders for generating SQL and Query Repositories for executing reads and writes.
- Most application code should prefer repositories unless custom SQL composition is required.
