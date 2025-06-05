/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",        // for app/index.tsx
    "./components/**/*.{js,jsx,ts,tsx}", // for Input and Button
    "./App.{js,jsx,ts,tsx}",             // root entry if needed
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
