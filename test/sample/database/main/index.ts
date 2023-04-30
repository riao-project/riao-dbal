import { TestDatabase } from '../../../util/database';

export default class MainDatabase extends TestDatabase {
	name = 'main';
}

export const maindb = new MainDatabase();
