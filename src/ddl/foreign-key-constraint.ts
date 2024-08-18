export type ForeignKeyReferenceOption = 'RESTRICT' | 'CASCADE' | 'SET NULL';

export interface FKReferenceSingle {
	column: string;
	referencesTable: string;
	referencesColumn: string;
}

export interface FKReferenceMultiple {
	columns: string[];
	referencesTable: string;
	referencesColumns: string[];
}

export type FKReference = FKReferenceSingle | FKReferenceMultiple;

export interface FKOptions {
	name?: string;
	onUpdate?: ForeignKeyReferenceOption;
	onDelete?: ForeignKeyReferenceOption;
}

export type ForeignKeyConstraint = FKOptions & FKReference;
export type InlineForeignKeyConstraint = FKOptions &
	Omit<FKReferenceSingle, 'column'>;
