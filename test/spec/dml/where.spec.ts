import 'jasmine';

import { Where } from '../../../src/dml/where';
import { gte, not, and, or, Conditions } from '../../../src/conditions';

describe('Where', () => {
	it('can create a where clause', () => {
		const where: Where[] = [
			{ tries: 3 },
			[{ fname: 'tom' }, 'or', { fname: 'bob' }],
			and,
			[{ lname: 'johnson' }, or, { lname: 'thompson' }],
			Conditions.and(),
			[{ age: gte(40) }, and, { age: not(50) }],
		];

		expect(<any>where[1]).toEqual([{ fname: 'tom' }, or, { fname: 'bob' }]);
		expect(<string>where[2]).toEqual('and');
	});
});
