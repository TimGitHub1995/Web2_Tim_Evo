module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],	
	daisyui: {
		themes: ["light",
			/*{
			  light: {
				...require("daisyui/src/theming/themes")["light"],
				primary: "blue",
				secondary: "teal",
			  },
			},*/
		   "dark", "cupcake", "fantasy"],
	},

};
