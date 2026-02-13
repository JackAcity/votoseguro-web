import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "voto-rojo": "#C8102E",
        "voto-blanco": "#FFFFFF",
        "voto-gris": "#F5F5F5",
        "voto-texto": "#1A1A1A",
        "voto-verde": "#22763F",
        "voto-amarillo": "#F7C948",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        cedula: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
