# Configuring databases

## Purpose

The config API loads database settings from a database-specific environment file.

## Entry point

```ts
import { configureDb, DatabaseEnv } from '@riao/dbal';

class MainDbEnv extends DatabaseEnv {
  public database = 'riao';
  public host = 'localhost';
  public port = 3307;
}

const env = configureDb(MainDbEnv, 'database', 'main');
```

## Behavior

`configureDb()` reads the environment file for the named database, using the project’s relative database folder convention. The default lookup pattern is:

```text
database/<name>/<name>.db.env
```

## Expected fields

A database environment class typically includes:

- `host`
- `port`
- `username`
- `password`
- `database`

## Notes

- This keeps configuration outside application code.
- The database name and folder names are part of the loader contract.
- The config layer is usually used before `Database.init()` is called.
