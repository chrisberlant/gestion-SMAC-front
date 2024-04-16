import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: 'tests/setup.ts',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@validationSchemas': path.resolve(
				__dirname,
				'./src/validationSchemas'
			),
			'@customTypes': path.resolve(__dirname, './src/types'),
			'@queries': path.resolve(__dirname, './src/queries'),
			'@modals': path.resolve(__dirname, './src/modals'),
			'@components': path.resolve(__dirname, './src/components'),
			'@tests-utils': path.resolve(__dirname, './tests/utils/index.ts'),
		},
	},
});
