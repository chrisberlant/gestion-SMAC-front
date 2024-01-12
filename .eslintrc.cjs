module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	settings: {
		'import/resolver': {
			alias: {
				map: [
					['@assets', './src/assets'],
					['@utils', './src/utils'],
					['@validationSchemas', './src/validationSchemas'],
					['@types', './src/types'],
				],
			},
			node: {
				paths: ['src'],
				extensions: ['.js', '.ts', '.d.ts', '.tsx'],
			},
		},
	},
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'import'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'@typescript-eslint/no-unused-vars': 'warn',
		'import/no-unresolved': 'error',
	},
	"settings": {
		"import/parsers": {
		"@typescript-eslint/parser": [".ts", ".tsx"]
		},
		"typescript": {
			"alwaysTryTypes": true,
		}
};
}
