const title = 'Antinomy Studio'
const description = ''
const url = ''

export default {
  // (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // (https://nuxtjs.org/docs/configuration-glossary/configuration-server/)
  server: {
    host: '0.0.0.0',
    port: 3000
  },

  // (https://nuxtjs.org/docs/configuration-glossary/configuration-generate/)
  generate: {
    fallback: '404.html'
  },

  // (https://nuxtjs.org/docs/configuration-glossary/configuration-env/)
  env: {},

  // (https://go.nuxtjs.dev/config-head)
  head: {
    title: title,
    meta: [
      { charset: 'utf-8' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: description },
      { hid: 'og:title', property: 'og:title', content: title },
      { hid: 'og:description', property: 'og:description', content: description },
      { hid: 'og:image', property: 'og:image', content: `${url}/share-fb.jpg` },
      { hid: 'og:url', property: 'og:url', content: url },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:creator', name: 'twitter:creator', content: '@antinomystudio' },
      { hid: 'twitter:title', name: 'twitter:title', content: title },
      { hid: 'twitter:description', name: 'twitter:description', content: description },
      { hid: 'twitter:image:src', name: 'twitter:image:src', content: `${url}/share-tw.jpg` },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/icon.png' }
    ]
  },

  // (https://nuxtjs.org/docs/configuration-glossary/configuration-css/)
  css: [
    '~assets/scss/main.scss'
  ],

  // (https://nuxtjs.org/docs/features/transitions/)
  pageTransition: {
    css: false
  },

  // (https://go.nuxtjs.dev/config-components)
  components: true,

  // (https://go.nuxtjs.dev/config-plugins)
  plugins: [{
    src: '~/plugins/performances.js',
    ssr: false
  },
  { src:'~/plugins/global.js' }
  ],

  // (https://go.nuxtjs.dev/config-modules)
  modules: [
    'nuxt-polyfill'
  ],

  // (https://nuxtjs.org/docs/directory-structure/modules/)
  buildModules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/eslint-module'
  ],

  // (https://www.npmjs.com/package/@nuxtjs/style-resources)
  styleResources: {
    scss: [
      '~assets/scss/common/_variables.scss'
    ]
  },

  // (https://www.npmjs.com/package/nuxt-polyfill)
  polyfill: {
    features: [{
      require: 'intersection-observer',
      detect: () => 'IntersectionObserver' in window,
    }, {
      require: 'requestidlecallback-polyfill',
      detect: () => 'requestIdleCallback' in window
    }, {
      require: 'requestanimationframe',
      detect: () => 'requestAnimationFrame' in window
    }]
  },

  // (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: true
  },

  // (https://github.com/nuxt/eslint-config)
  eslint: {
    fix: true
  }
}
