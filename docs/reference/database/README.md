# Database

## Purpose

`Database` is the main runtime entry point for query, DDL, schema, migration, and seed operations. It coordinates a database driver with the repositories that use it.

**NOTE** You'll normally want to use the `npx riao db:create` command to create new database connections in your repository.

## Loading a database

For a database module stored under `database/<name>`, use `loadDatabase()`:

```ts
import { loadDatabase } from '@riao/dbal';

const db = await loadDatabase('database', 'main');
const users = db.getQueryRepository({ table: 'users' });
```

The loader imports `database/main`, constructs its default `Database` export, sets `databasePath`, and calls `init()`. The database module must configure a driver and environment type, and its environment file normally follows the `database/<name>/<name>.db.env` convention. Omit the first argument to use the default database path, and omit the second argument to load `main`.

## Extending `Database`

`Database` is abstract and has no database-engine-specific driver. A subclass must provide `name`, `driverType`, and `envType`:

```ts
import { Database, DatabaseDriver, DatabaseEnv } from '@riao/dbal';

class MainDbEnv extends DatabaseEnv {}

class MainDatabase extends Database {
  public name = 'main';
  public driverType = MainDatabaseDriver;
  public envType = MainDbEnv;
}
```

`MainDatabaseDriver` represents the driver implementation for the database engine. It must implement the connection, query, version, and transaction operations defined by `DatabaseDriver`.

## Initialization

```ts
await db.init();
```

Initialization configures the environment, creates or uses the driver, connects to the database, loads schema metadata, and initializes the default repositories. Calling `init()` again after successful initialization does nothing.

Pass connection settings directly when an environment file is not used:

```ts
await db.init({
  connectionOptions: {
    host: 'localhost',
    port: 3306,
    database: 'riao',
    username: 'user',
    password: 'password',
  },
  useSchemaCache: false,
});
```

Repositories created before initialization are queued and initialized when `init()` completes. The default `query`, `ddl`, and `schemaQuery` properties are available after initialization.

## Repositories and builders

```ts
const query = db.getQueryRepository({ table: 'users' });
const ddl = db.getDataDefinitionRepository();
const schemaQuery = db.getSchemaQueryRepository();

const queryBuilder = db.getQueryBuilder();
const ddlBuilder = db.getDataDefinitionBuilder();
```

`getQueryRepository()` accepts query-repository options such as `table` and returns a repository initialized with the database driver and schema.

## Schema

```ts
const schema = await db.getSchema();
await db.buildSchema();
await db.saveSchema();
await db.loadSchema();
```

`init()` loads schema metadata from `<schemaDirectory>/schema.json` when `useSchemaCache` is enabled and the file exists. Otherwise it queries the database through `schemaQuery`, stores the result, and uses it to initialize query repositories. The defaults are:

- `useSchemaCache`: `true`
- `schemaDirectory`: `.schema`

Set `useSchemaCache` to `false` in `init()` or on the database subclass to always rebuild the schema.

## Transactions

```ts
await db.transaction(async (transaction) => {
  await transaction.query.insert({
    table: 'users',
    records: [{ name: 'Ada' }],
  });
});
```

The callback receives transaction-scoped `driver`, `query`, and `ddl` objects. The driver controls the transaction boundaries.

## Connection lifecycle

```ts
await db.connect();
await db.disconnect();
```

`init()` connects automatically. Call `disconnect()` when the application is finished with the database.

## Paths and configuration

These properties are relative to the database root and name:

- `databasePath`: root directory containing database folders
- `name`: database folder and configuration name
- `migrations`: migrations directory, default `migrations`
- `seeds`: seeds directory, default `seeds`
- `schemaDirectory`: schema cache directory, default `.schema`

The corresponding helpers return full paths:

```ts
db.getMigrationsDirectory();
db.getSeedsDirectory();
db.getSchemaDirectory();
```
