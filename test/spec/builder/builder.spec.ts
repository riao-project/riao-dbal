import { DatabaseQueryOptions } from '../../../src';
import { Builder } from '../../../src/builder';

describe('Builder', () => {
	class TestBuilder extends Builder {
		public toDatabaseQuery(): DatabaseQueryOptions {
			return { sql: 'SELECT * FROM table' };
		}
	}

	it('should create a new instance of the same class', () => {
		const builder = new TestBuilder();
		const nextBuilder = builder.createNext();

		expect(nextBuilder).toBeInstanceOf(TestBuilder);
		expect(nextBuilder).not.toBe(builder);
	});

	it('should set the next property to the new instance', () => {
		const builder = new TestBuilder();
		const nextBuilder = builder.createNext();

		expect(builder.next).toBe(nextBuilder);
	});

	it('should return an array with a single query when there is no next builder', () => {
		const builder = new TestBuilder();
		const queries = builder.getQueries();

		expect(queries).toEqual([{ sql: 'SELECT * FROM table' }]);
	});

	it('should return an array with queries from the builder chain', () => {
		const builder = new TestBuilder();
		const nextBuilder = builder.createNext();
		nextBuilder.createNext();

		const queries = builder.getQueries();

		expect(queries).toEqual([
			{ sql: 'SELECT * FROM table' },
			{ sql: 'SELECT * FROM table' },
			{ sql: 'SELECT * FROM table' },
		]);
	});
});
