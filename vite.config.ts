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
			'@tests-utils': path.resolve(__dirname, './tests/utils/index.ts'),
		},
	},
});
