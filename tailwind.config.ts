
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			textShadow: {
                sm: '0 1px 2px var(--tw-shadow-color)',
                DEFAULT: '0 2px 4px var(--tw-shadow-color)',
                lg: '0 8px 16px var(--tw-shadow-color)',
            },
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                silk: {
                    '50': '#fcf7f7',
                    '100': '#f7eeec',
                    '200': '#efe0d6',
                    '300': '#e3c7b6',
                    '400': '#d3a48f',
                    '500': '#c4866e',
                    '600': '#b46b5b',
                    '700': '#96584e',
                    '800': '#7a4943',
                    '900': '#643e38',
                },
                gold: {
                    '50': '#fefdf5',
                    '100': '#fefbe7',
                    '200': '#fcf5c2',
                    '300': '#faec8e',
                    '400': '#f7dc5a',
                    '500': '#f5d033', /* Adjusted to match logo */
                    '600': '#e3b520',
                    '700': '#bd8e19',
                    '800': '#996e1a',
                    '900': '#7c591b',
                },
                burgundy: {
                    '50': '#f5f2fc',
                    '100': '#ede5fa',
                    '200': '#dccaf5',
                    '300': '#c5a2ed',
                    '400': '#ac74e3',
                    '500': '#9249d8', /* Adjusted to match logo */
                    '600': '#7a31be',
                    '700': '#68279d',
                    '800': '#562380',
                    '900': '#4a2068',
                },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities, theme, variants }) {
            const newUtilities = {
                '.text-shadow': {
                    textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
                },
                '.text-shadow-md': {
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
                },
                '.text-shadow-lg': {
                    textShadow: '0 15px 30px rgba(0, 0, 0, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)',
                },
                '.text-shadow-none': {
                    textShadow: 'none',
                },
            };
            addUtilities(newUtilities, variants('textShadow'));
        },
	],
} satisfies Config;
