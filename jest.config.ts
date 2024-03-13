import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	testEnvironment: 'jsdom',
	preset: 'ts-jest/presets/js-with-ts',
	setupFilesAfterEnv: ['../jest-setup.ts'],
	rootDir: './components',
	transformIgnorePatterns: [
		'node_modules/(?!(lit|@lit|lit-html|lit-element|lodash-es|jest-axe|query-selector-shadow-dom)/.*)',
	],
};
export default config;
