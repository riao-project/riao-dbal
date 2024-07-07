import { TestDatabase } from '../../../util/database';

export default class MainDatabase extends TestDatabase {
	override name = 'main';
}

export const maindb = new MainDatabase();
