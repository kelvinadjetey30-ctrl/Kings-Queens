import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { gold: '#D4AF37', purple: '#4B0082', orange: '#FF6A00' } } },
  plugins: [],
};
export default config;
