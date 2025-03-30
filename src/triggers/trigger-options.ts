import { DatabaseQueryBuilder } from '../dml';
import { Expression } from '../expression';

export interface TriggerOptions {
	name?: string;
	table: string;
	timing: TriggerTiming;
	event: TriggerEvent;
	body: TriggerBody;
}

export type TriggerTiming = 'BEFORE' | 'AFTER';
export type TriggerEvent = 'INSERT' | 'UPDATE' | 'DELETE';
export type TriggerBody = string | DatabaseQueryBuilder;

export interface TriggerUpdateOptions {
	table: string;
	idColumn: string;
	set: Record<string, Expression>;
}

export interface DropTriggerOptions {
	name: string;
	table: string;
	ifExists?: boolean;
}
