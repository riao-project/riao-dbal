import { DatabaseQueryOptions } from './query';

export type SelectColumn = string;

export interface SelectQuery {
	columns?: SelectColumn[];
	from?: string;
}

export type Query = SelectQuery;

export class DatabaseQueryBuilder {
	protected sql = '';
	protected params: Record<string, any> = {};

	public selectColumnList(columns?: SelectColumn[]): this {
		this.sql += columns ? columns.join(', ') + ' ' : '* ';

		return this;
	}

	public selectFrom(from?: string): this {
		this.sql += from ? 'FROM ' + from + ' ' : ' ';

		return this;
	}

	public selectStatement(): this {
		this.sql += 'SELECT ';

		return this;
	}

	public select(query: SelectQuery): this {
		this.selectStatement();
		this.selectColumnList(query.columns);
		this.selectFrom(query.from);

		return this;
	}

	public toDatabaseQuery(): DatabaseQueryOptions {
		return {
			sql: this.sql.trim(),
			params: this.params,
		};
	}
}
