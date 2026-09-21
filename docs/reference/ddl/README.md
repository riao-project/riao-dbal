# Changing schema

## Purpose

DDL (data definition language) changes database structure: databases, tables,
columns, indexes, users, permissions, constraints, and triggers.

## Entry point

Use `DataDefinitionBuilder` to generate SQL. Every builder method returns a
builder, so call `toDatabaseQuery()` when you need the SQL string.

```ts
import { ColumnType, DataDefinitionBuilder } from '@riao/dbal';

const ddl = new DataDefinitionBuilder();
```

## Create table

```ts
const { sql } = ddl
  .createTable({
    name: 'user',
    columns: [
      { name: 'id', type: ColumnType.INT, primaryKey: true },
      { name: 'fname', type: ColumnType.VARCHAR, length: 128 },
    ],
  })
  .toDatabaseQuery();
```

Generated SQL:

```sql
CREATE TABLE "user" ("id" INT, "fname" VARCHAR(128), PRIMARY KEY ("id"))
```

Use `ifNotExists: true` to add `IF NOT EXISTS`. Columns can also specify
`required`, `default`, `autoIncrement`, `isUnique`, and inline foreign-key
options.

## Databases and indexes

```ts
ddl.createDatabase({ name: 'mydb' }).toDatabaseQuery().sql;
// CREATE DATABASE mydb

ddl.createIndex({ table: 'user', column: 'email' }).toDatabaseQuery().sql;
// CREATE INDEX idx_user_email ON "user"("email")
```

Pass `name` to `createIndex` when the generated `idx_<table>_<column>` name is not suitable.

## Users and permissions

```ts
ddl.createUser({ name: 'app', password: 'secret' }).toDatabaseQuery().sql;
// CREATE USER app WITH PASSWORD 'secret'

ddl.grant({
  privileges: ['SELECT', 'INSERT'],
  on: { database: 'mydb', table: 'user' },
  to: 'app',
}).toDatabaseQuery().sql;
// GRANT SELECT, INSERT ON mydb.user TO app
```

`grant` is currently intended for MySQL and MSSQL and may change database
connection state. Use it cautiously and with a dedicated connection.

## Foreign keys

Foreign keys can be declared on a table or added later:

```ts
ddl.addForeignKey({
  table: 'post',
  columns: ['userId'],
  referencesTable: 'user',
  referencesColumns: ['id'],
  onDelete: 'CASCADE',
}).toDatabaseQuery().sql;
// ALTER TABLE "post" ADD CONSTRAINT fk_post_userId
// FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
```

Use `onUpdate` and `onDelete` with `RESTRICT`, `CASCADE`, or `SET NULL`.

## Alter table

```ts
ddl.addColumns({
  table: 'user',
  columns: [{ name: 'email', type: ColumnType.VARCHAR, length: 255 }],
}).toDatabaseQuery().sql;
// ALTER TABLE "user" ADD "email" VARCHAR(255)

ddl.changeColumn({
  table: 'user',
  column: 'email',
  options: { name: 'email', type: ColumnType.VARCHAR, length: 512 },
});

ddl.dropColumn({ table: 'user', column: 'email' });
ddl.renameTable({ table: 'user', to: 'users' });
ddl.dropForeignKey({ table: 'post', fk: 'fk_post_userId' });
```

The last four methods also return builders and can be inspected with
`toDatabaseQuery()`.

## Drop and truncate

```ts
ddl.dropDatabase({ name: 'mydb', ifExists: true }).toDatabaseQuery().sql;
// DROP DATABASE IF EXISTS mydb

ddl.dropTable({ tables: 'user', ifExists: true }).toDatabaseQuery().sql;
// DROP TABLE IF EXISTS "user"

ddl.dropUser({ names: ['app', 'reporting'], ifExists: true });
ddl.truncate({ table: 'user' });
```

`dropTable` and `dropUser` accept either one name or an array of names.

## Triggers

```ts
ddl.createTrigger({
  table: 'user',
  timing: 'BEFORE',
  event: 'INSERT',
  body: 'SET NEW.created_at = NOW()',
}).toDatabaseQuery().sql;
// CREATE TRIGGER user_before_insert BEFORE INSERT ON "user"
// FOR EACH ROW BEGIN SET NEW.created_at = NOW(); END;

ddl.dropTrigger({
  name: 'user_before_insert',
  table: 'user',
  ifExists: true,
});
```

Trigger events are `INSERT`, `UPDATE`, and `DELETE`; timing can be `BEFORE` or `AFTER`.

## Migrations

DDL is usually executed through the database's `ddl` repository in a migration:

```ts
import { ColumnType, Migration } from '@riao/dbal';

export default class AddEmail extends Migration {
  public override async up() {
    await this.ddl.addColumns({
      table: 'user',
      columns: [{ name: 'email', type: ColumnType.VARCHAR, length: 255 }],
    });
  }
}
```

See the [migration reference](../migration/README.md) for the migration
lifecycle.

## Notes

- DDL changes database structure rather than rows; row changes belong to DML.
- Builder-generated SQL can be inspected before execution with
  `toDatabaseQuery()`.
- Database support varies by driver, so verify generated statements against
  the target database.
