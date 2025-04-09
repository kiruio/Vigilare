import { defineConfig } from 'unocss';

export default defineConfig({
	theme: {
		animation: {
			keyframes: {
				breathing: `{
				0% { transform: scale(1); opacity: 0.8; }
				100% { transform: scale(2); opacity: 0; }
				}`,
			},
		},
	},
});
