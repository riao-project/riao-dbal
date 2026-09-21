# Repositories

## Purpose

A repository wraps a database driver and exposes an API for executing queries.
`QueryRepository` adds table-aware methods for reading and writing records.

For supported read and write operations, see the [DML reference](../dml/README.md).

## Entry point

```ts
import { Database } from '@riao/dbal';

const repo = db.getQueryRepository<User>({ table: 'user' });
```

## Repository behavior

### Table resolution

When a query omits `table`, `QueryRepository` uses the table configured when
the repository was created. An operation-level `table` takes precedence.

### Primary-key resolution

`findById()` and `insertOne()` use the configured `identifiedBy` column, then
the primary key discovered from the schema. Pass an explicit primary key when
schema discovery is unavailable.

### Result behavior

```ts
const row = await repo.findOne({ where: { id: 42 } });
// null when no row matches

const required = await repo.findOneOrFail({ where: { id: 42 } });
// throws when no row matches
```

`insertOne()` returns the inserted row when a primary key is available. Pass
`ignoreReturnId: true` when the database cannot or should not return it.

### Driver and logging

The base `Repository` provides direct query execution and query logging:

```ts
await repo.query(databaseQuery);

repo.startLog();
repo.stopLog();
repo.setLog((query) => console.log(query));
```

Repositories must be initialized with a database driver before querying.

## Notes

- Result rows are returned as plain objects keyed by column names.
- Repository behavior is driven by the database schema when available.
