<template>
  <div>
    <Preloader v-if="!assetsPreloaded" />
    <FocusLock :disabled="!menuOpen">
      <Header />
      <Menu v-if="menuOpen" />
    </FocusLock>
    <Nuxt />
    <Webgl />
  </div>
</template>

<script>
import 'focus-visible';
import sniffer from '@antinomy-studio/sniffer';
import FocusLock from 'vue-focus-lock';
import { mapActions, mapState } from 'vuex';

import AssetsLoader from '~/mixins/assetsLoader';

import throttle from '~/utils/functions/throttle';

import Header from '~/components/header/Header.vue';
import Menu from '~/components/menu/Menu.vue';
import Preloader from '~/components/preloader/Preloader.vue';
import Webgl from '~/components/webgl/Webgl.vue';

export default {
  name: 'DefaultLayout',

  components: {
    FocusLock,
    Header,
    Menu,
    Preloader,
    Webgl,
  },

  mixins: [AssetsLoader],

  computed: {
    ...mapState('app', ['assetsPreloaded', 'menuOpen']),
  },

  watch: {
    $route: 'onRouteChange',
  },

  beforeMount() {
    this.$root.smooth = sniffer.isDesktop && this.$performances.PERF >= this.$performances.PERFS.PERF_HIGH
    this.$root.smooth && document.documentElement.classList.add('is-smooth')

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
      // Close menu if open
      if (this.menuOpen) {
        this.setMenuOpen(false);
      }
    },

    ...mapActions('app', ['setWindowSize', 'setMenuOpen']),
  },
};
</script>
