<template>
  <div>
    <Preloader v-if="!assetsPreloaded" />
    <Header />
    <Menu v-if="menuOpen" />
    <Nuxt />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import throttle from '~/utils/functions/throttle';

import Header from '~/components/header/Header.vue';
import Menu from '~/components/menu/Menu.vue';
import Preloader from '~/components/preloader/Preloader.vue';

export default {
  name: 'DefaultLayout',

  components: {
    Header,
    Menu,
    Preloader,
  },

  computed: {
    ...mapState('app', ['assetsPreloaded', 'menuOpen']),
  },

  watch: {
    $route: 'onRouteChange',
  },

  beforeMount() {
    window.addEventListener('resize', throttle(this.onResize, 66), false);
    requestAnimationFrame(this.onRaf);

    this.loadFonts();
    this.setWindowSize();
  },

  methods: {
    loadFonts() {
      const hasCustomFont = true;
      if (document.fonts && hasCustomFont) {
        const Font = new FontFace('Matter', 'url(/fonts/Matter-Regular.woff2)', {
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

    onResize() {
      this.setWindowSize();
      this.$root.$emit('window:resize');
    },

    onRaf() {
      this.$root.$emit('window:raf');
      requestAnimationFrame(this.onRaf);
    },

    onRouteChange() {
      if (this.menuOpen) {
        this.setMenuOpen(false);
      }
    },

    ...mapActions('app', ['setWindowSize', 'setMenuOpen']),
  },
};
</script>
