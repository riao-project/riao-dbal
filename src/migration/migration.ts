import { QueryRepository } from '../repository/query-repository';
import { DataDefinitionRepository } from '../repository/ddl-repository';
import { DatabaseDriver } from '../driver';

export class Migration {
	protected driver: DatabaseDriver;
	protected ddl: DataDefinitionRepository;
	protected dml: QueryRepository;

	public constructor(driver: DatabaseDriver) {
		this.driver = driver;
		this.ddl = new DataDefinitionRepository(driver);
		this.dml = new QueryRepository(driver);
	}

	public async up(): Promise<void> {}

	public async down(): Promise<void> {}
}
