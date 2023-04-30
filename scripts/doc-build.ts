import { execSync } from 'child_process';
import { readdirSync } from 'fs';

export default async function docBuild(): Promise<void> {
	const files = readdirSync('src')
		.filter((file) => file !== 'index.ts')
		.map((file) => 'src/' + file)
		.join(' ');

	const cmd = `typedoc --out docs/typedoc ${files} --readme README.md`;

	execSync(cmd);
}
