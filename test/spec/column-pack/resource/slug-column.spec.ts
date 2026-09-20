import 'jasmine';
import { ColumnType } from '../../../../src/column';
import { SlugColumn } from '../../../../src/column-pack/resource';

describe('SlugColumn', () => {
	it('defines a required unique slug varchar column', () => {
		expect(SlugColumn).toEqual({
			name: 'slug',
			type: ColumnType.VARCHAR,
			length: 255,
			isUnique: true,
			required: true,
		});
	});
});
