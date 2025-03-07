import { Expression, SimpleExpression } from '../expression';
import { DatabaseRecord } from '../record';
import { Join } from './join';
import { GroupBy } from './group-by';
import { OrderBy } from './order-by';
import { From } from './from';

export type SelectColumnString<T extends DatabaseRecord = DatabaseRecord> =
	keyof Partial<T> & string;

export interface SelectColumnAs<T extends DatabaseRecord = DatabaseRecord> {
	column: SelectColumnString;
	as?: string;
}

export interface SelectColumnFromExpression {
	query: SimpleExpression | SimpleExpression[];
	as: string;
}

export type SelectColumn<T extends DatabaseRecord = DatabaseRecord> =
	| SelectColumnString<T>
	| SelectColumnAs<T>
	| SelectColumnFromExpression;

export interface SelectQuery<T extends DatabaseRecord = DatabaseRecord> {
	columns?: SelectColumn<T>[];
	distinct?: boolean;
	table?: From;
	tableAlias?: string;
	join?: Join[];
	where?: Expression<T>;
	limit?: number;
	offset?: number;
	groupBy?: GroupBy<T>;
	having?: Expression<T>;
	orderBy?: OrderBy<T>;
}
