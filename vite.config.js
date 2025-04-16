
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from '@zerodevx/svelte-img/vite'
import tailwindcss from '@tailwindcss/vite';
import tailwindConfig from './tailwind.config';


export default defineConfig({
	plugins: [

		sveltekit(),
		imagetools(),
		tailwindcss()
		
	],
	server: {
		fs: {
			// Allow access to files from the project root.
			allow: ['..']
		}
	}
});
