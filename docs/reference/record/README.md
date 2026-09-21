# Working with records

## Purpose

Records are plain row-shaped objects used to represent the data returned by query repositories.

The module exports two aliases:

```ts
import { DatabaseRecord, DatabaseRecordId } from '@riao/dbal';

type Id = DatabaseRecordId; // number | string
type Row = DatabaseRecord;  // Record<string, any>
```

Use application-specific interfaces or type aliases when the row shape is known. `DatabaseRecord` is the untyped boundary used by generic repository and schema APIs; it does not validate column names or value types.

## Example

```ts
export interface UserRecord {
  id: number;
  email: string;
  username: string;
  created_at: Date;
}
```

## Usage

```ts
const user = await repo.findOne({
  table: 'user',
  where: { id: 1 },
});
```

The returned value is a record object shaped like the repository type or null.

## Notes

- Records are typically plain objects rather than persistent model classes.
- The database returns rows as structured values keyed by column names.
- Repositories are the usual way to move between rows and typed application objects.
