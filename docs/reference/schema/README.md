# Inspecting schema

## Purpose

Schema repositories expose table and column metadata for the active database.

## Entry point

```ts
const schema = await db.getSchema();
```

Or through the schema repository:

```ts
const schemaQuery = db.getSchemaQueryRepository();
const schema = await schemaQuery.getSchema();
```

## Typical usage

```ts
const pk = schema.tables.user.primaryKey;
console.log(pk);
```

`SchemaTableWithColumns` entries contain the table name, whether the object is a table or view, a column map, and an optional primary-key name:

```ts
const userTable = schema.tables.user;
userTable.type;             // 'table' | 'view'
userTable.columns.email;    // ColumnOptions
userTable.primaryKey;       // string | undefined
```

The query repository also exposes focused lookups:

```ts
const tables = await schemaQuery.getTables();
const columns = await schemaQuery.getColumns({ table: 'user' });
const primaryKey = await schemaQuery.getPrimaryKeyName({ table: 'user' });
const complete = await schemaQuery.getTablesWithColumns();
```

## Notes

- The schema is used to resolve repository identifiers and table metadata.
- It is often populated during `Database.init()`.
- The schema cache can be stored on disk and reused when `useSchemaCache` is enabled.
- Column metadata is returned as `ColumnOptions`; database type names are normalized to the corresponding `ColumnType` spelling where supported.
