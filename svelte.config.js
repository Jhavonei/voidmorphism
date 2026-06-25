import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// `script: true` routes <script lang="ts"> through esbuild so all TS syntax
	// (e.g. optional params) is transpiled, not just stripped natively.
	preprocess: vitePreprocess({ script: true }),
	kit: {
		// Fully prerendered, static showcase — deployable to any host
		// (Vercel, Netlify, GitHub Pages, Cloudflare).
		adapter: adapter({
			fallback: '404.html'
		})
	}
};

export default config;
