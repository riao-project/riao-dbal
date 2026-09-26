import { Expression } from '../expression';
import { DatabaseRecord } from '../record';
import { From } from './from';
import { Join } from './join';

/**
 * Update expression or value
 */
type UpdateExpression<T extends DatabaseRecord> = {
	[K in keyof T]: T[K] | Expression<T>;
};

export interface UpdateOptions<T extends DatabaseRecord = DatabaseRecord> {
	table?: string;
	from?: From;
	join?: Join[];
	set: Partial<UpdateExpression<T>>;
	where?: Expression<T>;
}
