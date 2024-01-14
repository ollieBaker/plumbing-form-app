import dotenv from "dotenv";
import { formList } from "./static/storeData.json";

dotenv.config();

const dynamicRoutes = () => {
  return new Promise((resolve) => {
    const forms = formList
      .filter((form) => !form.hidden)
      .map((form) => `/form/${form.id}`);
    const ladderListNew = "/form/ladder-list/new";
    const submissions = "/submissions";
    const formTables = formList.map((form) => `/submissions/${form.api}`);
    resolve([...forms, ...formTables, ladderListNew, submissions]);
  });
};

export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: "Client Plumbing",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Generate dynamic routes
   */
  generate: {
    fallback: true,
    routes: dynamicRoutes
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/vue-formulate.js",
    "~/plugins/portal-vue.js",
    "~/plugins/signature-pad.js",
    "~/plugins/vue-tables.js",
    "~/plugins/handle.js",
    "~/plugins/event-bus.js",
    "~/plugins/axios",
    "~/plugins/axios",
    "~/plugins/globals"
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
    "@nuxtjs/tailwindcss"
  ],
  tailwindcss: {
    configPath: "~/config/tailwind.config.js",
    cssPath: "~/assets/css/tailwind.css",
    exposeConfig: false
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
    "@nuxtjs/auth",
    "nuxt-webfontloader"
  ],
  /*
   ** Auth module configuration
   ** See https://auth.nuxtjs.org/#getting-started
   */
  auth: {
    redirect: {
      login: "/login",
      logout: false,
      home: "/",
      callback: false
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: `${process.env.BASE_URL}auth/local`,
            method: "post",
            propertyName: "jwt"
          },
          logout: false,
          user: {
            url: `${process.env.BASE_URL}users/me`,
            method: "get",
            propertyName: false
          }
        },
        autoFetchUser: false
      }
    }
  },
  router: {
    middleware: ["auth"]
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.BASE_URL
  },
  /*
   ** Web Fonts
   ** See https://github.com/Developmint/nuxt-webfontloader
   */
  webfontloader: {
    google: {
      families: ["Open+Sans:400,500,700"]
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    terser: {
      terserOptions: {
        safari10: true,
        compress: {
          drop_console: process.env.NODE_ENV === "production"
        }
      }
    },
    babel: {
      babelrc: false,
      cacheDirectory: undefined,
      presets: ["@nuxt/babel-preset-app"]
    }
  },
  env: {
    buildDate: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    BASE_URL: process.env.BASE_URL
  }
};
