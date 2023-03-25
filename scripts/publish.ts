import { CommandRunner } from 'ts-script';

export default async function publish() {
	const cmd = new CommandRunner();

	cmd.run('npm run script -- prep', {
		loadingDescription: 'Preparing',
		finishedDescription: 'Prepared',
	});

	cmd.run('npm publish', {
		loadingDescription: 'Publishing',
		finishedDescription: 'Published',
		dir: 'dist/src',
	});
}
