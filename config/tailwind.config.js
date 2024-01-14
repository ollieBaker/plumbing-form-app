/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  purge: {
    enabled: true,
    content: [
      "components/**/*.vue",
      "layouts/**/*.vue",
      "pages/**/*.vue",
      "plugins/**/*.js",
      "nuxt.config.js"
    ],
    // These options are passed through directly to PurgeCSS
    options: {
      whitelist: [
        "tailwind",
        "table-auto",
        "border",
        "px-4",
        "py-2",
        "bg-gray-100",
        "grid-rows-1",
        "flex",
        "label",
        "p-1",
        "flex-initial",
        "m-2",
        "is-horizontal",
        "is-pulled-right",
        "is-pulled-left",
        "text-center",
        "is-centered",
        "icon",
        "is-small",
        "marginless",
        "button",
        "is-selected",
        "dropdown",
        "relative",
        "dropdown-trigger",
        "round",
        "dropdown-menu",
        "absolute",
        "z-50",
        "bg-white",
        "p-2",
        "dropdown-content",
        "truncate",
        "flex-1",
        "dropdown-item",
        "mb-1",
        "fa",
        "fa-angle-down",
        "mt-1",
        "text-left",
        "ml-1",
        "pagination",
        "m-1",
        "rounded",
        "block",
        "w-7",
        "bg-blue-700",
        "text-white",
        "text-gray-400"
      ]
    }
  },
  theme: {
    fontFamily: {
      sans: [
        "Open Sans",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif"
      ]
    },
    extend: {
      colors: {
        red: "#CD2B34",
        "red-gradient": "#D70924",
        yellow: "#f7c412"
      }
    }
  },
  variants: {}
};
