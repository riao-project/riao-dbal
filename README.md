# riao-dbal

[![npm version](https://badge.fury.io/js/%40riao%2Fdbal.svg)](https://badge.fury.io/js/%40riao%2Fdbal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful TypeScript Database Abstraction Layer (DBAL) that provides a unified interface for working with multiple database types including MySQL, PostgreSQL, MSSQL, and SQLite.

## Features

- 🔄 **Multi-Database Support**: Work with multiple databases using the same API
- 🏗️ **TypeScript First**: Full TypeScript support with type safety and autocompletion
- 🔨 **Query Builder**: Fluent interface for building complex SQL queries
- 📊 **Reporting & Analytics**: Built-in support for aggregations, window functions, and complex data analysis
- 🚀 **Migrations**: Version control for your database schema
- 📦 **Column Pack**: Ready-to-use column definitions for common fields like usernames, emails, and timestamps
- 🌱 **Seeding**: Populate your database with test data
- 🔍 **Schema Management**: Track and manage your database schema
- 💰 **Transactions**: Support for database transactions
- 🛠️ **DDL Operations**: Create, alter, and drop database objects
- ⚡ **Database Functions**: Built-in support for common database functions


## Getting Started

Read the [getting started guide](https://stateless-studio.atlassian.net/wiki/spaces/Riao/pages/294916/Guide).

## Preview

### Creating a new Database

`npx riao db:create`

[Database Setup Guide](https://stateless-studio.atlassian.net/wiki/spaces/Riao/pages/328113/Setup+a+Database)

### Creating a Migration

`npx riao migration:create create-users-table`

[Database Migration Guide](https://stateless-studio.atlassian.net/wiki/spaces/Riao/pages/328666/Building+a+Database+Schema)

```typescript
import { Migration } from '@riao/dbal';
import { ColumnType } from '@riao/dbal';
import {
	BigIntKeyColumn,
	EmailColumn,
	UsernameColumn,
	PasswordColumn,
	CreateTimestampColumn,
	UpdateTimestampColumn,
} from '@riao/dbal/column-pack';

export default class Users extends Migration {
	override async up() {
		await this.ddl.createTable({
			name: 'users',
			ifNotExists: true,
			columns: [
				BigIntKeyColumn,
				UsernameColumn,
				EmailColumn,
				PasswordColumn,
				{
					name: 'balance',
					type: ColumnType.DECIMAL,
					significant: 15,
					decimal: 2,
					required: true,
					default: 10000.0,
				},
				CreateTimestampColumn,
				UpdateTimestampColumn,
			],
		});
	}

	override async down() {
		await this.ddl.dropTable({
			tables: 'users',
			ifExists: true,
		});
	}
}

```

Run your migrations with 
`npx riao migration:run`

### Creating Repositories

`src/users/user-repository.ts`
```typescript
export interface User {
	id: number;
	username: string;
	email: string;
	password: string;
	balance: number;
	create_timestamp: Date;
	update_timestamp: Date;
}


export class users = maindb.getQueryRepository<User>({
	table: 'users'
});
```

[Model Repositories Guide](https://stateless-studio.atlassian.net/wiki/spaces/Riao/pages/753686/Model+Repositories)

### Queries

```typescript

// Insert a record
await users.insertOne({
    name: 'John Doe',
    email: 'john@example.com'
});

// Find records
const results = await users.find({
    where: {
        email: 'john@example.com'
    }
});
```

[Query Guide](https://stateless-studio.atlassian.net/wiki/spaces/Riao/pages/99430/Querying+the+Database)

## Documentation

For detailed documentation, please [read the docs](https://stateless-studio.atlassian.net/wiki/spaces/Riao/pages/295404/Docs)!

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/riao-project/riao-dbal/issues) on our GitHub repository.
