export interface DataModelColumn {
	id: number;
	table_id: number;
	name: string;
	data_type: string;
	default_value_type: 'none' | 'null' | 'literal' | 'function' | 'expression';
	default_value: string | null;
	is_primary_key: boolean;
	is_required: boolean;
	is_unique: boolean;
	references_table: string | null;
	references_column: string | null;
}
