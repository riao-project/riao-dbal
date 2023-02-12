import { Where } from './where';

export interface UpdateOptions {
	table: string;
	set: { [key: string]: any };
	where?: Where | Where[];
}
