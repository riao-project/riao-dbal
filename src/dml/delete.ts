import { Join } from './join';
import { Where } from './where';

export interface DeleteOptions {
	table: string;
	join?: Join[];
	where: Where | Where[];
}
