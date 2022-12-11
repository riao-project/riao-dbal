import { Config, BundleMap, bundlePackageJson } from 'ts-packager';

export const config: Config = {
	buildDir: 'dist/src/' // Where to put the build files
};

export const files: BundleMap = {
	// Copy the changelog to the build
	'CHANGELOG.md': true,
	// Copy the license to the build
	'LICENSE.md': true,
	// Copy the readme to the build
	'README.md': true,
	// Copy the package.json to the build, removing scripts & dependencies
	'package.json': bundlePackageJson
};
