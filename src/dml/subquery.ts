import { SelectQuery } from './select';

export class Subquery {
	public query: SelectQuery;

	public constructor(query: SelectQuery) {
		this.query = query;

		return this;
	}
}
