# Automating database triggers

## Purpose

Triggers let you add database-side logic, especially for timestamp or audit behavior.

## Base class

```ts
import {
  DatabaseFunctions,
  DatabaseQueryBuilder,
  DatabaseTrigger,
  DatabaseTriggerConstructorOptions,
  GetTriggerBodyOptions,
} from '@riao/dbal';

export class MyUpdateTimestampTrigger extends DatabaseTrigger {
  protected name = 'update_timestamp';

  protected column: string;
  protected idColumn: string;

  public constructor(options: UpdateTimestampTriggerConstructorOptions) {
    super(options);

    this.column = options.column;
    this.idColumn = options.idColumn;
  }

  protected override getBody(
    options: GetTriggerBodyOptions
  ): DatabaseQueryBuilder {
    return options.queryBuilder.triggerSetValue({
      table: this.table,
      idColumn: this.idColumn,
      column: this.column,
      value: DatabaseFunctions.currentTimestamp(),
    });
  }
}

interface UpdateTimestampTriggerConstructorOptions
  extends DatabaseTriggerConstructorOptions {
  column: string;
  idColumn: string;
}
```

`@riao/dbal` already ships this exact trigger as `UpdateTimestampTrigger`, importable directly. Pass the table, the column to update, and the row's ID column when constructing a trigger. `getTrigger()` produces the DDL-ready options object, including the generated name, timing, event, table, and SQL body:

```ts
const trigger = new UpdateTimestampTrigger({
  table: 'users',
  column: 'updated_at',
  idColumn: 'id',
});
const options = trigger.getTrigger({ queryBuilder });
// options.timing: 'BEFORE' | 'AFTER'
// options.event: 'INSERT' | 'UPDATE' | 'DELETE'
```

Override `timing` and `event` when the trigger should run at a different point. The DDL repository consumes the resulting `TriggerOptions`; use `DropTriggerOptions` when removing a trigger.

## Notes

- The trigger class is a database-side helper, not application-side business logic.
- Trigger bodies are built as SQL fragments via a query builder.
- Triggers are defined on a table and executed as part of database events.
- The default timing is `BEFORE` and the default event is `UPDATE`.
