const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        // make sure it's pointing to the ROOT node_module
        "../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};
