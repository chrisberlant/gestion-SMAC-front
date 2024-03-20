import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@validationSchemas': path.resolve(
				__dirname,
				'./src/validationSchemas'
			),
			'@types': path.resolve(__dirname, './src/types'),
			'@queries': path.resolve(__dirname, './src/queries'),
			'@modals': path.resolve(__dirname, './src/modals'),
		},
	},
});
