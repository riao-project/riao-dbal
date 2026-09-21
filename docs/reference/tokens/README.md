# Identifier tokens

## Purpose

Identifier tokens represent column or table references without treating them as literal values.

## Entry point

```ts
import { columnName } from '@riao/dbal';
```

## Example

```ts
const column = columnName('user.id');
```

When consumed by a query builder, this produces a qualified identifier. For a driver that uses double quotes, it renders as:

```sql
"user"."id"
```

## Notes

- Use identifier tokens in expressions, database functions, and custom query-builder code.
- The active database driver determines how identifiers are enclosed.
- `columnName` accepts an identifier name, not a value. Do not pass untrusted user input directly to it.
- Other expression token types are documented in [Expression](../expression/README.md), [Comparison](../comparison/README.md), and [Functions](../functions/README.md).
