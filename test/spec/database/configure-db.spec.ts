import 'jasmine';
import { configureDb } from '../../../src/';
import { TestDatabaseEnv } from '../../util/database';

describe('configureDb', () => {
	it('can read .db.env file', async () => {
		const env = configureDb(
			TestDatabaseEnv,
			'test/sample/database',
			'main'
		);

		expect(env.host).toEqual('localhost');
		expect(env.port).toEqual(3307);
		expect(env.username).toEqual('riao');
		expect(env.password).toEqual('password1234');
		expect(env.database).toEqual('riao');
	});
});
