import { ColumnType } from '../column';

export interface RiaoSchemaTableRecord {
	id?: number;
	name: string;
}

export interface RiaoSchemaColumnRecord {
	id?: number;
	table_id: number;
	name: string;
	data_type: ColumnType;
	data_length?: number;
	significant?: number;
	decimal?: number;
	is_primary_key: boolean;
	is_auto_incrementing: boolean;
	is_required: boolean;
	is_unique: boolean;
}
