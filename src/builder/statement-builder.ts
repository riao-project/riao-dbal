import { Builder } from './builder';
import { SqlBuilder } from './sql-builder';
import { DatabaseQueryOptions } from '../database';

export abstract class StatementBuilder extends Builder {
	protected sql: SqlBuilder;

	public constructor() {
		super();

		this.sql = new (this.getSqlType())();
	}

	protected getSqlType(): typeof SqlBuilder {
		return SqlBuilder;
	}

	public override toDatabaseQuery(): DatabaseQueryOptions {
		return this.sql.toDatabaseQuery();
	}

	public appendBuilder(builder: Builder) {
		const q = builder.toDatabaseQuery();
		this.sql.append(q.sql);
		this.sql.appendParams(q.params ?? []);
	}
}
