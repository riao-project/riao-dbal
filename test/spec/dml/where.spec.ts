import 'jasmine';

import { Expression } from '../../../src/expression';
import { gte } from '../../../src/comparison';
import { and, or, not } from '../../../src/expression';

describe('Where', () => {
	it('can create a where clause', () => {
		const where: Expression = [
			{ tries: 3 },
			[{ fname: 'tom' }, or, { fname: 'bob' }],
			and,
			[{ lname: 'johnson' }, or, { lname: 'thompson' }],
			and,
			[{ age: gte(40) }, and, { age: not(50) }],
		];

		expect(<any>where[1]).toEqual([{ fname: 'tom' }, or, { fname: 'bob' }]);
		expect(<any>where[2]).toEqual(and);
	});
});
