/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agent: '#3498db',
        runner: '#e74c3c',
        functionTool: '#f39c12',
        guardrail: '#9b59b6',
      }
    },
  },
  plugins: [],
}
