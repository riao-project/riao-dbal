import {
	DatabaseTrigger,
	DatabaseTriggerConstructorOptions,
	GetTriggerBodyOptions,
} from '../../../src/triggers/trigger';
import { DatabaseQueryBuilder } from '../../../src/dml';
import { TriggerOptions } from '../../../src/triggers/trigger-options';
import { columnName } from '../../../src';

class TestTrigger extends DatabaseTrigger {
	protected name = 'test_trigger';

	protected getBody(options: GetTriggerBodyOptions): DatabaseQueryBuilder {
		return options.queryBuilder.update({
			table: this.table,
			set: { test2: columnName('test1') },
			where: {
				id: columnName(`${options.queryBuilder.getTriggerNew()}.id`),
			},
		});
	}
}

describe('DatabaseTrigger', () => {
	let trigger: TestTrigger;
	let options: DatabaseTriggerConstructorOptions;

	beforeEach(() => {
		options = { table: 'test_table' };
		trigger = new TestTrigger(options);
	});

	it('should return correct trigger options', () => {
		const expected: TriggerOptions = {
			name: 'test_table_test_trigger',
			timing: 'BEFORE',
			event: 'UPDATE',
			table: 'test_table',
			body: 'UPDATE "test_table" SET "test2" = "test1" WHERE ("id" = "NEW"."id")',
		};

		const actual = trigger.getTrigger({
			queryBuilder: new DatabaseQueryBuilder(),
		});

		expect(actual).toEqual(expected);
	});
});
