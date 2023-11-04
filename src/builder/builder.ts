import { DatabaseQueryOptions } from '../database';

export abstract class Builder {
	public toDatabaseQuery(): DatabaseQueryOptions {
		throw new Error('Must override toDatabaseQuery()');
	}
}
