/** @type {import('prettier').Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-jsdoc', 'prettier-plugin-svelte'],
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{
			files: ['README.md'],
			options: {
				useTabs: false,
				tabWidth: 4
			}
		}
	]
};

export default config;
