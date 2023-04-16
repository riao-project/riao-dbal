export type GrantPrivileges = 'ALL' | 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE';

export type GrantOn =
	| '*'
	| { database: string }
	| { database: string; table: string };

export interface GrantOptions {
	privileges: GrantPrivileges | GrantPrivileges[];
	on: GrantOn;
	to: string | string[];
}
