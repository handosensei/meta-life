<template>
  <div>
    <Preloader v-if="!assetsPreloaded" />
    <FocusLock :disabled="!menuOpen">
      <Header />
      <Menu v-if="menuOpen" />
    </FocusLock>
    <Nuxt />
  </div>
</template>

<script>
import 'focus-visible';
import FocusLock from 'vue-focus-lock';
import { mapActions, mapState } from 'vuex';

import assetsLoader from '~/mixins/assetsLoader';

import throttle from '~/utils/functions/throttle';

import Header from '~/components/header/Header.vue';
import Menu from '~/components/menu/Menu.vue';
import Preloader from '~/components/preloader/Preloader.vue';

export default {
  name: 'DefaultLayout',

  components: {
    FocusLock,
    Header,
    Menu,
    Preloader,
  },

  mixins: [assetsLoader],

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
        const fontMatterNormal = new FontFace('Matter', 'url(/fonts/Matter-Regular.woff2)', {
          style: 'normal',
          weight: '400',
        });
        const fontMatterMedium = new FontFace('Matter', 'url(/fonts/Matter-Medium.woff2)', {
          style: 'normal',
          weight: '500',
        });
        Promise.all([fontMatterNormal.load(), fontMatterMedium.load()]).then(() => {
          document.fonts.add(fontMatterNormal);
          document.fonts.add(fontMatterMedium);
          this.$root.$emit('fonts:loaded');
        });
      } else {
        this.$root.$emit('fonts:loaded');
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
