/** @type {import("prettier").Options} */
export default {
	useTabs: true,
	singleQuote: false,
	printWidth: 100,
	tabWidth: 4,
	arrowParens: "always",
	bracketSpacing: true,
	bracketSameLine: false,
	plugins: ["prettier-plugin-svelte"],
	overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
};
