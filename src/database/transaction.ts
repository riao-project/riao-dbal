import { DataDefinitionRepository } from '../ddl';
import { QueryRepository } from '../dml';
import { DatabaseDriver } from './driver';

export interface Transaction {
	driver: DatabaseDriver;
	ddl: DataDefinitionRepository;
	query: QueryRepository;
}
