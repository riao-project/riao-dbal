import 'jasmine';
import { SqlBuilder } from '../../../src/builder';

describe('SqlBuilder', () => {
	it('should prepend text to the SQL', () => {
		const builder = new SqlBuilder()
			.append('FROM users')
			.prepend('SELECT * ');

		expect(builder.toDatabaseQuery().sql).toBe('SELECT * FROM users');
	});

	it('should return itself when prepending text', () => {
		const builder = new SqlBuilder();

		expect(builder.prepend('SELECT ')).toBe(builder);
	});
});
