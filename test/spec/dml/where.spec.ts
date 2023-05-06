import 'jasmine';

import { Where, and, or, gte, not } from '../../../src/dml/where';

describe('Where', () => {
	it('can create a where clause', () => {
		const where: Where[] = [
			{ tries: 3 },
			[{ fname: 'tom' }, or, { fname: 'bob' }],
			and,
			[{ lname: 'johnson' }, or, { lname: 'thompson' }],
			and,
			[{ age: gte(40) }, and, { age: not(50) }],
		];

		expect(<any>where[1]).toEqual([{ fname: 'tom' }, or, { fname: 'bob' }]);
		expect(<string>where[2]).toEqual('and');
	});
});
