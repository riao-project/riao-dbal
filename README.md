# riao-dbal - Readme

## GET STARTED WITH RIAO!

https://stateless-studio.atlassian.net/wiki/spaces/Riao/pages/295535/Start+Here

## Custom Installation

`npm i @riao/dbal`
`npm i -D @riao/cli`

You'll also need to install a database driver:

**MySQL**
`npm i @riao/mysql`

**Microsoft SQL Server**
`npm i @riao/mssql`

**Postgres**
`npm i @riao/postgres`

## Project Setup

Create a folder in the root of your project named `database`. Your database(s) will go in here.

### Create a database

In your new database folder, create a folder called `main`. This will be your main database.

In this folder, you'll need two files: a `main.db.env` file to configure your database, and an `index.ts` file to export your database.

You're folder structure should now look like this:

```
|- database
	|- main
		|- index.ts
		|- main.db.env
|- src
|- package.json
```

Let's create the index file first. This file create a database class for our database, named `MainDatabase`. It extends `DatabaseMySql8` because that's the driver we want to use.

`database/main/index.ts`
```typescript
import { DatabaseMySql8 } from 'riao-driver-mysql';

export default class MainDatabase extends DatabaseMySql8 {}

export const maindb = new MainDatabase();
```

Now we can setup a mysql database, and provide the connection configuration in our env file:

`database/main/main.db.env`
```
port=3307
username=riao
password=password1234
database=riao
```

Don't forget to add the `database/` folder to your tsconfig:

`tsconfig.json`
```json
{
	...
	"include": ["./database", "./src" ...]
}
```

### Using the database

To use our new database, we can import from the index file, init() it, and use it!

`src/main.ts`
```typescript
import { maindb } from '../database/main';

export async function main() {
	await maindb.init(); // Make sure to `init()` the database first!

	await maindb.query.insert({
		table: 'user',
		records: [
			{
				id: 23,
				email: 'tom@tester.com',
				password: 'asdfa2342',
			},
		],
	});

	const users = await maindb.query.find({
		table: 'user',
		where: {
			email: 'tom@tester.com',
		},
	});

	console.log(users);
	// [ { id: 23, email: 'tom@tester.com', password: 'asdfa2342', } ]

	await maindb.query.update({
		table: 'user',
		set: {
			password: 'password1234',
		},
		where: {
			email: 'tom@tester.com',
		},
	});

	const user = await maindb.query.findOneOrFail({
		table: 'user',
		where: { id: 23 },
	});

	console.log(user);
	// { id: 23, email: 'tom@tester.com', password: 'password1234' }

	await maindb.query.delete({
		table: 'user',
		where: {
			id: user.id,
		},
	});
}
```

## Custom Config (No database folder/files required)

**WARNING:** Using this method will not let you take advantage of migrations, seeds, or riao's `.env` loading!

If you don't want to create a database folder and files, you can load & configure a database manually:

```typescript
import { ColumnType } from 'riao-dbal';
import { DatabaseMySql8 } from 'riao-driver-mysql';

const db = new DatabaseMySql8();

await db.init({
	host: 'localhost',
	port: 3306,
	username: 'riao',
	password: 'password1234',
	database: 'riao',
});

await db.ddl.createTable({
	name: 'user',
	ifNotExists: true,
	columns: [
		{
			name: 'id',
			type: ColumnType.BIGINT,
			primaryKey: true,
			autoIncrement: true,
		},
		{
			name: 'email',
			type: ColumnType.VARCHAR,
			length: 255,
		},
		{
			name: 'password',
			type: ColumnType.VARCHAR,
			length: 255,
		},
	],
});

await db.query.insert({
	table: 'user',
	records: [
		{
			email: 'test@example.com',
			password: 'password1234',
		},
	],
});

const users = await db.query.find({
	table: 'user',
	where: { email: 'test@example.com' },
});

console.log(users);
// [ { id: 1, email: 'test@example.com', password: 'password1234' } ]

const user = await db.query.findOneOrFail({
	table: 'user',
	where: { email: 'test@example.com' },
});

console.log(user);
// { id: 1, email: 'test@example.com', password: 'password1234' }
```

## Hierarchy

### Builder

A builder generates sql queries to be run against a database.

#### DDL Builder

The DDL (Data definition language) Builder builds queries for creating, updating, and truncating databases, tables, etc.

#### Query (DML) Builder

The Query (DML - Data manipulation language) Builder builds queries for creating, querying, updating, and deleting records.

```typescript
const query = db
	.getQueryBuilder()
	.select({
		table: 'user',
		where: {
			id: 2,
		},
	})
	.toDatabaseQuery();

console.log(query);
// { sql: 'SELECT * FROM user WHERE (id = ?)', params: [ 2 ] }
```

### Repository

Repositories are functions to build queries (using the builders) and run them against a database.

#### DDL Repository

The DDL Builder contains functions to use generate DDL queries and run them against a database.

#### Query Repository

The Query Builder contains functions to use generate DML queries and run them against a database.

### Database Drivers

Drivers contain functions to interact with the underlying database.

### Database

A database has a driver, connection options, builders, and repositories. Once you create a database and connect to it, you can use it's repositories or builders to query that database.

## Contributing & Development

See [contributing.md](docs/contributing/contributing.md) for information on how to develop or contribute to this project!
