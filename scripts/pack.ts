import { CommandRunner } from 'ts-script';

export default async function pack() {
	const cmd = new CommandRunner();

	cmd.run('npm run script -- prep', {
		loadingDescription: 'Preparing',
		finishedDescription: 'Prepared',
	});

	cmd.run('npm pack ./dist/src', {
		loadingDescription: 'Packing',
		finishedDescription: 'Packed',
	});
}
