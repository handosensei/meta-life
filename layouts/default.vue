<template>
  <div>
    <Nuxt ref="page" />
  </div>
</template>

<script>
  import size from '@antinomy-studio/size'
  import sniffer from '@antinomy-studio/sniffer'
  
  export default {
    data: () => ({}),
    beforeMount() {
      sniffer.addClasses(document.documentElement)
      this.loadFonts()
      this.setViewport('--vhf')
      this.setViewport('--vh')
      this.setTheme()
    },
    mounted() {
      this.onRoute()
      this.onResize(size.width, size.height)
      size.addListener(this.onResize)
    },
    methods: {
      loadFonts() {
        const hasCustomFont = false
        if (document.fonts && hasCustomFont) {
          const Font = new FontFace('Font-Name', 'url(/fonts/Font-Name.woff2)', {
            style: 'normal',
            weight: '400'
          })
          Promise.all([Font.load()]).then(() => {
            document.fonts.add(Font)
            this.$root.$emit('fonts:loaded')
          })
        } else {
          this.$root.$emit('fonts:loaded')
        }
      },
      setTheme(options = { color: 'black', background: 'white' }) {
        const { documentElement } = document
        documentElement.style.setProperty('--color', options.color)
        documentElement.style.setProperty('--background', options.background)
      },
      setViewport(prop = '--vh') {
        const { documentElement } = document
        const vh = size.height * 0.01
        documentElement.style.setProperty(prop, `${vh}px`)
      },
      onRoute() {
        this.$router.beforeEach((to, from, next) => {
          const current = this.$refs.page.$children[0]
          if (to.path !== from.path) {
            current.animateOut({ to })
            next()
          } else {
            next()
          }
        })
      },
      onResize(width, height) {
        this.setViewport('--vh')
      }
    }
  }
</script>