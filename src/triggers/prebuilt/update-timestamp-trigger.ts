import { DatabaseQueryBuilder } from '../../dml';
import { DatabaseFunctions } from '../../functions';
import {
	DatabaseTrigger,
	DatabaseTriggerConstructorOptions,
	GetTriggerOptions,
} from '../trigger';
import { TriggerEvent, TriggerTiming } from '../trigger-options';

export class UpdateTimestampTrigger extends DatabaseTrigger {
	public name = 'update_timestamp';
	public timing: TriggerTiming = 'BEFORE';
	public event: TriggerEvent = 'UPDATE';

	protected column: string;
	protected idColumn: string;

	public constructor(options: UpdateTimestampTriggerConstructorOptions) {
		super(options);

		this.column = options.column;
		this.idColumn = options.idColumn;
	}

	getBody(options: GetTriggerOptions): DatabaseQueryBuilder {
		return options.queryBuilder.triggerSetValue({
			table: this.table,
			idColumn: this.idColumn,
			column: this.column,
			value: DatabaseFunctions.currentTimestamp(),
		});
	}
}

export interface UpdateTimestampTriggerConstructorOptions
	extends DatabaseTriggerConstructorOptions {
	column: string;
	idColumn: string;
}
