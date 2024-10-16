import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import solid from "@astrojs/solid-js"

// https://astro.build/config
export default defineConfig({
	output: "server",
	site: 'https://my-url.de/', // this line is required
	integrations: [mdx(), tailwind(), solid({include: ['**/solid/*']})],
});
