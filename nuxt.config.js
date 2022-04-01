export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Loading: https://nuxtjs.org/docs/features/loading
  loading: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Meta Life',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/scss/index.scss'],

  // Exposed styles: https://github.com/nuxt-community/style-resources-module#readme
  styleResources: {
    scss: ['~/assets/scss/mixins.scss', '~/assets/scss/vars.scss', '~/assets/scss/type.scss'],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/stylelint-module', '@nuxtjs/style-resources'],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxt/image', '@nuxtjs/svg', 'nuxt-polyfill'],

  // (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: '~/plugins/global.js', ssr: false }],

  // (https://www.npmjs.com/package/nuxt-polyfill)
  polyfill: {
    features: [
      {
        require: 'requestidlecallback-polyfill',
        detect: () => 'requestIdleCallback' in window,
      },
    ],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['gsap'],
  },

  // Server Configuration: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server
  server: {
    host: '0.0.0.0',
  },
};
