import { DatabaseQueryOptions } from '../database';

export abstract class Builder {
	public next?: typeof this;

	public createNext() {
		this.next = <typeof this>new (this.constructor as any)();

		return this.next;
	}

	public getQueries(): DatabaseQueryOptions[] {
		const queries: DatabaseQueryOptions[] = [this.toDatabaseQuery()];

		let i = this.next;

		while (i) {
			queries.push(i.toDatabaseQuery());
			i = i.next;
		}

		return queries;
	}

	public abstract toDatabaseQuery(): DatabaseQueryOptions;
}
