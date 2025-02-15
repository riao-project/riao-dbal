import { DatabaseQueryOptions } from '../database';

export abstract class Builder {
	public next?: typeof this;

	public createNext() {
		this.next = <typeof this>new (this.constructor as any)();

		return this.next;
	}

	public toDatabaseQuery(): DatabaseQueryOptions {
		throw new Error('Must override toDatabaseQuery()');
	}
}
