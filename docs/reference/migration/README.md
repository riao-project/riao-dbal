# Managing migrations

## Purpose

Migrations track database changes as code so a schema can evolve reliably across environments.

**NOTE**: Create migrations with `npx riao migration:create [migration-name]`

## Base class

```ts
import { ColumnType, Migration } from '@riao/dbal';

export default class CreateUsersTable extends Migration {
  public override async up() {
    await this.ddl.createTable({
      name: 'users',
      columns: [
        { name: 'id', type: ColumnType.INT, primaryKey: true },
      ],
    });
  }

  public override async down() {
    await this.ddl.dropTable({ tables: 'users', ifExists: true });
  }
}
```

## Runtime pieces

- `this.db`: database instance
- `this.ddl`: DDL repository
- `this.query`: query repository

## Running migrations

The CLI creates and runs migrations from the configured database project:

```text
npx riao migration:create create-users-table
npx riao migration:run
```

Migration records are stored in the database so the runner applies each migration once and preserves its order. A migration is not automatically idempotent: use the DDL options deliberately when a migration may be rerun.

`MigrationPackage` can group packaged migrations when migrations are loaded from a library rather than from individual files.

## Notes

- The built-in migration runner executes them in order.
- `up()` applies the change; `down()` reverses it when needed.
