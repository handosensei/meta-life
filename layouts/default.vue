<template>
  <div>
    <transition name="preloaderTransition" :css="false" @leave="onPreloaderLeave">
      <Preloader v-if="hasPreloader" ref="preloader" />
    </transition>
    <FocusLock :disabled="!menuOpen">
      <Header />
      <div class="site-border"></div>
      <transition name="menuTransition" mode="out-in" :css="false" @enter="onMenuEnter" @leave="onMenuLeave">
        <Menu v-if="menuOpen" ref="menu" />
      </transition>
    </FocusLock>
    <Nuxt />
    <Webgl ref="webgl" />
    <AudioPlayer />
  </div>
</template>

<script>
import 'focus-visible';
import sniffer from '@antinomy-studio/sniffer';
import FocusLock from 'vue-focus-lock';
import { mapActions, mapState } from 'vuex';
import { gsap } from 'gsap';

import AssetsLoader from '~/mixins/assetsLoader';

import throttle from '~/utils/functions/throttle';

import Header from '~/components/header/Header.vue';
import Menu from '~/components/menu/Menu.vue';
import Preloader from '~/components/preloader/Preloader.vue';
import Webgl from '~/components/webgl/Webgl.vue';
import AudioPlayer from '~/components/audioPlayer/AudioPlayer.vue';

export default {
  name: 'DefaultLayout',

  components: {
    FocusLock,
    Header,
    Menu,
    Preloader,
    Webgl,
    AudioPlayer,
  },

  mixins: [AssetsLoader],

  computed: {
    ...mapState('app', ['hasPreloader', 'preloaderVisible', 'assetsPreloaded', 'menuOpen']),
  },

  watch: {
    preloaderVisible: 'onRouteChange',
    $route: 'onRouteChange',
  },

  beforeMount() {
    this.$root.smooth = sniffer.isDesktop && this.$performances.PERF >= this.$performances.PERFS.PERF_HIGH;
    this.$root.smooth && document.documentElement.classList.add('is-smooth');
    this.$root.sectionTransitionDuration = 1500;
    this.$root.menuTransitionDuration = 1500;

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
      if (this.$route.name !== 'index') {
        gsap.to(this.$refs.webgl.$el, {
          autoAlpha: 0,
          duration: 0.2,
          ease: 'none',
          onComplete: () => {
            window.canvas.props.active = false;
          },
        });
      } else {
        console.log(window.canvas.props.active);
        window.canvas.props.active = true;
        console.log(this.$refs.webgl.$el);
        gsap.to(this.$refs.webgl.$el, {
          autoAlpha: 1,
          duration: 0.6,
          ease: 'none',
          delay: 0.25,
        });
      }
      if (this.menuOpen) {
        this.setMenuOpen(false);
      }
    },

    onPreloaderLeave(_, done) {
      this.$refs.preloader.leave(done);
    },

    onMenuEnter() {
      this.$refs.menu.enter();
    },

    onMenuLeave(_, done) {
      this.$refs.menu.leave(done);
    },

    ...mapActions('app', ['setWindowSize', 'setMenuOpen']),
  },
};
</script>
