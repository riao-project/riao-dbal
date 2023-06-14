import { join as joinPath } from 'path';

import { ConfigurationOptions, configure } from 'ts-appconfig';
import { DatabaseEnv } from './database-env';

/**
 * Load the database's .env
 *
 * @param env Environment Type (must extend DatabaseEnv)
 * @param path Path to env file
 * @param name Database name
 * @param options ts-appconfig options
 * @returns Returns the loaded environment variables
 */
export function configureDb<T extends DatabaseEnv>(
	env: { new (): T },
	path: string,
	name: string,
	options: ConfigurationOptions = {}
): T {
	return <T>(<unknown>configure(env, {
		relativePath: joinPath(path, name, `${name}.db.env`),
		fromProcessEnv: false,
		overwriteProcessEnv: false,
		...options,
	}));
}
