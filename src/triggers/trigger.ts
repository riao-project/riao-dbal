import { DatabaseQueryBuilder } from '../dml';
import { TriggerEvent, TriggerOptions, TriggerTiming } from './trigger-options';

export abstract class DatabaseTrigger {
	protected abstract name: string;
	protected timing: TriggerTiming = 'BEFORE';
	protected event: TriggerEvent = 'UPDATE';

	protected table: string;

	public constructor(options: DatabaseTriggerConstructorOptions) {
		this.table = options.table;
	}

	public getTrigger(options: GetTriggerOptions): TriggerOptions {
		return {
			name: this.getName(),
			timing: this.timing,
			event: this.event,
			table: this.table,
			body: this.getBody(options).toDatabaseQuery().sql,
		};
	}

	protected getName(): string {
		return `${this.table}_${this.name}`;
	}

	protected abstract getBody(
		options: GetTriggerBodyOptions
	): DatabaseQueryBuilder;
}

export interface DatabaseTriggerConstructorOptions {
	table: string;
}

export interface GetTriggerBodyOptions {
	queryBuilder: DatabaseQueryBuilder;
}

export type GetTriggerOptions = GetTriggerBodyOptions;
