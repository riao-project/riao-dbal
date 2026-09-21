# Filtering records

## Purpose

Comparisons define the conditions used in `where` clauses and other expression contexts.

## Typical tokens

```ts
import {
  gt,
  gte,
  lt,
  lte,
  equals,
  notEqual,
  like,
  between,
  inArray,
  and,
  or,
  not,
} from '@riao/dbal';
```

## Example

```ts
const where = {
  status: 'active',
  age: gte(18),
};
```

## Comparison object shape

Comparison values can be either:

- a literal value
- a comparison token such as `gt(18)` or `like('%@example.com')`
- a logical grouping built from `and`, `or`, and `not`

Example:

```ts
const where = [
  { email: 'person@example.com' },
  and,
  { created_at: gte(new Date('2024-01-01')) },
];
```

## Comparison helpers

### `equals(value)`

Matches an exact value.

```ts
const where = {
  status: equals('active'),
};
```

### `notEqual(value)`

Matches values that are not equal to the provided value.

```ts
const where = {
  status: notEqual('archived'),
};
```

### `gt(value)`

Matches values greater than the provided value.

```ts
const where = {
  age: gt(18),
};
```

### `gte(value)`

Matches values greater than or equal to the provided value.

```ts
const where = {
  age: gte(18),
};
```

### `lt(value)`

Matches values less than the provided value.

```ts
const where = {
  age: lt(18),
};
```

### `lte(value)`

Matches values less than or equal to the provided value.

```ts
const where = {
  age: lte(18),
};
```

### `like(value)`

Matches a pattern using SQL-style wildcard matching.

```ts
const where = {
  email: like('%@example.com'),
};
```

### `inArray(values)`

Matches a value that is included in a list of allowed values.

```ts
const where = {
  role: inArray(['admin', 'editor']),
};
```

### `between(a, b)`

Matches values within a range, inclusive of the endpoints.

```ts
const where = {
  age: between(18, 65),
};
```

## Notes

- Comparison data is consumed by the query builder when building `WHERE` clauses.
- The library supports common operators such as equality, range checks, membership, and pattern matching.
- Available comparison aliases include `equals`, `notEqual`, `gt`, `gte`, `lt`, `lte`, `between`, `inArray`, and `like`.
- Logical grouping is expressed with `and`, `or`, and `not` tokens
- Filter shapes are deliberately designed to read like simple data objects rather than raw SQL fragments.
