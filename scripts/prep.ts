import { CommandRunner } from 'ts-script';

export default async function prep() {
	const cmd = new CommandRunner();

	cmd.run('npm i', {
		loadingDescription: 'Installing',
		finishedDescription: 'Installed',
	});

	cmd.run('npm run lint:prod', {
		loadingDescription: 'Linting',
		finishedDescription: 'Linted',
	});

	cmd.run('npm run build', {
		loadingDescription: 'Building',
		finishedDescription: 'Built',
	});

	cmd.run('npx ts-packager', {
		loadingDescription: 'Packaging',
		finishedDescription: 'Packaged',
	});
}
