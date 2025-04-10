import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
	presets: [
		presetUno({
			important: true,
		}),
		presetIcons(),
	],
	transformers: [transformerDirectives()],
	theme: {
		colors: {
			mainBackground: '#ffffff',
			primary: '#3bd672',
			secondary: '#747474',
			normal: '#3bd672',
			error: '#de484a',
			loading: '#58d0ff',
		},
		animation: {
			keyframes: {
				breathing:
					'{0% {transform: scale(1); opacity: 0.8;} 100% {transform: scale(2); opacity: 0;}}',
				spin: '{0% {rotate: 0deg;} 100% {rotate: 360deg;}}',
			},
		},
		breakpoints: {
			sm: '420px',
			md: '670px',
			lg: '980px',
			'520': '520px',
		},
	},
	shortcuts: {
		'transition-opacity':
			'transition-property-opacity transition-duration-300 transition-ease-in-out',
	},
});
