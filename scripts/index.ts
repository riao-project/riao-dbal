/* eslint-disable no-console */
if (process.argv.length < 3) {
	throw new Error('Usage: npm run script -- my-script');
}

console.log('Running script', process.argv[2]);
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const run = require('./' + process.argv[2]);

run.default()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
