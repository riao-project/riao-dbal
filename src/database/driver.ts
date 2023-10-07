import { DatabaseConnectionOptions } from './connection-options';
import {
	DatabaseQueryOptions,
	DatabaseQueryResult,
	DatabaseQueryTypes,
} from './driver-query';
import { Builder } from '../builder';
import { Transaction } from './transaction';

export class DatabaseDriver {
	public conn;

	public async connect(options: DatabaseConnectionOptions): Promise<this> {
		throw new Error('DatabaseDriver missing connect method');
	}

	public async disconnect(): Promise<void> {
		throw new Error('DatabaseDriver missing disconnect method');
	}

	public async query(
		options: DatabaseQueryTypes
	): Promise<DatabaseQueryResult> {
		throw new Error('DatabaseDriver missing query method');
	}

	public async getVersion(): Promise<string> {
		throw new Error('DatabaseDriver missing getVersion method');
	}

	public async transaction<T>(
		fn: (transaction: Transaction) => Promise<T>,
		transaction: Transaction
	): Promise<T> {
		throw new Error('DatabaseDriver missing transaction method');
	}

	protected toDatabaseQueryOptions(
		from: DatabaseQueryTypes
	): DatabaseQueryOptions {
		if (from instanceof Builder) {
			return from.toDatabaseQuery();
		}

		return from;
	}
}
