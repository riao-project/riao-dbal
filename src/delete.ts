import { Where } from "./where";

export interface DeleteOptions {
	table: string;
	where: Where | Where[];
}
