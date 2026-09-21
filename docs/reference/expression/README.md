# Building SQL expressions

Expressions are values, identifiers, conditions, operators, and SQL fragments which can be composed by the query builders. They are accepted by `where` and `having`, and simple expressions can also be used for selected columns, updates, inserts, and database functions.

## Entry points

```ts
import {
  CaseExpression,
  DatabaseFunctions,
  DatabaseQueryBuilder,
  Expression,
  SimpleExpression,
  Subquery,
  and,
  columnName,
  exists,
  gt,
  inArray,
  not,
  notExists,
  or,
  plus,
  raw,
  times,
} from '@riao/dbal';
```

The expression module also exports `Identifier` as an alias for the identifier
factory, but `columnName` is the usual public name for identifier expressions.

## Expression shapes

`SimpleExpression` is a value that can be used as part of a query expression:

- literals such as strings, numbers, booleans, `null`, `Date`, `bigint`, and `Buffer`
- identifier tokens created with `columnName`
- database-function tokens, math tokens, raw-expression tokens, subqueries, and `CaseExpression` values
- arrays of simple expressions

`Expression` also includes comparison tokens, logical tokens, key/value
condition objects, and arrays of expressions. A key/value object combines its fields with `AND`:

```ts
const condition: Expression = {
  active: true,
  age: gt(18),
};
```

Values are bound as query parameters by the builder. Identifiers and raw SQL are emitted as SQL, so they must not contain untrusted input.

## Simple expressions

Literal values are the simplest expressions. They are useful in conditions and are passed to the database as parameters:

```ts
const query = new DatabaseQueryBuilder()
  .select({
    table: 'user',
    columns: ['id'],
    where: { status: 'active' },
  })
  .toDatabaseQuery();
```

The result is equivalent to:

```ts
query.sql; // SELECT "id" FROM "user" WHERE ("status" = ?)
query.params; // ['active']
```

Use `columnName` when a value should refer to another database identifier rather than become a parameter:

```ts
const userName = columnName('user.name');
```

This renders as `"user"."name"` for a driver that uses double-quoted identifiers. See [Identifier tokens](../tokens/README.md) for more detail.

## Medium expressions

### Logical composition

Use `and` and `or` tokens inside an expression array. Arrays are rendered as a parenthesized expression. Use `not` to negate an expression or a comparison:

```ts
const where: Expression = [
  { status: 'active' },
  and,
  [{ role: inArray(['admin', 'editor']) }, or, { age: gt(65) }],
];

const excluded = not({ status: 'archived' });
```

Comparison helpers such as `gt`, `inArray`, `between`, and `like` are described in [Comparison](../comparison/README.md).

### Arithmetic and functions

Math tokens are placed between their operands. Operands may be literals, identifiers, or other simple expressions:

```ts
const discountedPrice = [
  columnName('price'),
  times,
  [columnName('discount'), plus, 1],
];

const displayName = DatabaseFunctions.concat(
  columnName('first_name'),
  ' ',
  columnName('last_name')
);
```

Available math tokens are `plus`, `minus`, `times`, `divide`, and `modulo`.
See [Functions](../functions/README.md) for database-function helpers.

## Advanced expressions

### Raw SQL with parameters

Use `raw` only for SQL syntax that the expression helpers do not cover. Keep
dynamic values in `params` so they remain bound parameters:

```ts
const available = raw('COALESCE(stock, ?) > ?', [0, 0]);
```

Do not interpolate user input into the `sql` string.

### Subqueries and `EXISTS`

Wrap a select query in `Subquery` when an expression needs a nested query:

```ts
const hasOrders = exists(
  new Subquery({
    table: 'orders',
    where: { user_id: 1 },
  })
);

const query = new DatabaseQueryBuilder()
  .select({ table: 'user', columns: ['id'], where: hasOrders })
  .toDatabaseQuery();
```

Use `notExists` for the inverse condition. A `Subquery` can also be used as a
selected expression.

### `CASE` expressions

`CaseExpression` accepts searched conditions, an optional comparison value, and
an optional fallback:

```ts
const label = new CaseExpression({
  case: [
    { when: { status: 'paid' }, then: 'Paid' },
    { when: { status: 'pending' }, then: 'Pending' },
  ],
  else: 'Unknown',
});

const query = new DatabaseQueryBuilder()
  .select({
    table: 'orders',
    columns: [{ query: label, as: 'status_label' }],
  })
  .toDatabaseQuery();
```

Set `value` on `CaseExpression` for a simple `CASE value WHEN ...` form. Each
`when` and `then` member is itself an expression.

## Type guards

When handling dynamic values, use `isExpressionToken` before inspecting a token,
then use a specific guard such as `isIdentifierToken`. Other token guards
include `isComparisonToken`, `isLogicalToken`, `isMathToken`, and
`isRawExprToken`.

## Related reference

- [Comparison](../comparison/README.md) for conditions used in `where` clauses.
- [Functions](../functions/README.md) for database-side computations.
- [Identifier tokens](../tokens/README.md) for qualified column and table names.
- [DML](../dml/README.md) for query-builder methods that consume expressions.
