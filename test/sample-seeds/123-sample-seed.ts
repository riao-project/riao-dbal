import { Seed } from '../../src/seed';

/**
 * Sample table seed
 */
export default class SampleSeed extends Seed {
	public table = 'sample';

	public records = [
		{
			fname: 'Bob',
			lname: 'West',
		},
		{
			fname: 'Tom',
			lname: 'Test',
		},
	];
}
