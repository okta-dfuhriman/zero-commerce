import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const defaultConfig = {
		plugins: [react(), svgr(), tsconfigPaths()],
	};

	if (mode !== 'production') {
		defaultConfig['server'] = { port: 3000 };
	}

	return defaultConfig;
});
