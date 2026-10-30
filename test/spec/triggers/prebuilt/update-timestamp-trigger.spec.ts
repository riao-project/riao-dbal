import { UpdateTimestampTrigger } from '../../../../src/triggers/prebuilt';
import { DatabaseQueryBuilder } from '../../../../src/dml';
import { TriggerOptions } from '../../../../src/triggers/trigger-options';

describe('UpdateTimestampTrigger', () => {
	let trigger: UpdateTimestampTrigger;

	beforeEach(() => {
		trigger = new UpdateTimestampTrigger({
			table: 'updated_at_test',
			column: 'updated_at',
			idColumn: 'id',
		});
	});

	it('should return correct trigger options', () => {
		const expected: TriggerOptions = {
			name: 'updated_at_test_updated_at',
			timing: 'BEFORE',
			event: 'UPDATE',
			table: 'updated_at_test',
			body: 'SET "NEW"."updated_at" = CURRENT_TIMESTAMP',
		};

		const actual = trigger.getTrigger({
			queryBuilder: new DatabaseQueryBuilder(),
		});

		expect(actual).toEqual(expected);
	});
});
