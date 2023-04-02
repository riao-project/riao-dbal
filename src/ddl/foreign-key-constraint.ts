export type ForeignKeyReferenceOption = 'RESTRICT' | 'CASCADE' | 'SET NULL';

export interface ForeignKeyConstraint {
	name?: string;
	columns: string[];
	referencesTable: string;
	referencesColumns: string[];
	onUpdate?: ForeignKeyReferenceOption;
	onDelete?: ForeignKeyReferenceOption;
}
