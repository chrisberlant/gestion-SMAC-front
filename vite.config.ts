import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true,
		},
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
