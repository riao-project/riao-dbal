import { Join } from './join';
import { Where } from './where';

export interface UpdateOptions {
	table: string;
	join?: Join[];
	set: { [key: string]: any };
	where?: Where | Where[];
}
