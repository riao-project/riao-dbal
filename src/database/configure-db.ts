import { join as joinPath } from 'path';

import { ConfigurationOptions, configure } from 'ts-appconfig';
import { DatabaseEnv } from './database-env';

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
