<template>
  <header class="header" :class="{ isDark: theme === 'light', menuOpen: menuOpen }">
    <IconButton ref="menuButton" as="button" class="menuButton" icon="MenuButton" :disabled="menuOpen || videoPlayerOpen" :on-click="onMenuButtonClick" aria-label="open menu button" />
    <IconButton ref="closeButton" as="button" class="closeButton" icon="CloseButton" :disabled="!menuOpen && !videoPlayerOpen" :on-click="onMenuButtonClick" aria-label="close menu button" />
    <Icon ref="wordmark" type="wordmark" class="wordmark" />
    <IconButton ref="openChapterNavButton" :disabled="chapterNavOpen" as="button" class="navButton" icon="NavButton" aria-label="open navigation button" @click.native="toggleChapterNav" />
    <IconButton
      ref="closeChapterNavButton"
      :disabled="!chapterNavOpen"
      as="button"
      class="closeButton right"
      icon="CloseButton"
      aria-label="close navigation button"
      @click.native="toggleChapterNav"
    />
    <IconButton v-if="!videoPlayerOpen" ref="logoButton" href="/" class="logoButton" icon="LogoButton" aria-label="go to homepage button" />
  </header>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import IconButton from '~/components/elements/IconButton.vue';
import Icon from '~/components/elements/Icon.vue';
import BREAKPOINTS from '~/utils/config/breakpoints';

export default {
  name: 'HeaderComponent',

  components: {
    IconButton,
    Icon,
  },

  computed: {
    ...mapState('app', ['theme', 'previousTheme', 'menuOpen', 'videoPlayerOpen', 'windowSize']),
    ...mapState('home', ['chapterNavOpen', 'galleryOpen']),
  },

  watch: {
    'galleryOpen': 'onGalleryOpen',
    'menuOpen': 'onMenuButtonToggle',
    // galleryOpen: 'onMenuButtonToggle',
    '$nuxt.$route.name': 'onRouteChange',
  },

  mounted() {
    this.initButtons();
    this.$root.$on('window:resize', this.onResize);
    this.$root.$on('chapter-nav:toggle', this.toggleChapterNav);
  },

  beforeDestroy() {
    this.$root.$off('window:resize', this.onResize);
    this.$root.$off('chapter-nav:toggle', this.toggleChapterNav);
  },

  methods: {
    onGalleryOpen(value) {
      console.log('value', value);
      gsap.to(this.$refs.menuButton.$el, {
        autoAlpha: value ? 0 : 1,
        duration: 0.4,
        delay: value ? 0 : 1.5,
        ease: 'none',
      });
    },

    onMenuButtonClick() {
      if (this.animating) {
        return;
      }

      // Close video player if open and return
      if (this.videoPlayerOpen) {
        this.setVideoPlayerOpen(false);
        return;
      }

      this.animating = true;

      // Keep track of previous theme before opening menu
      if (!this.menuOpen) {
        this.setPreviousTheme(this.theme);
      }

      if (this.menuOpen) {
        // If closing the menu reset the theme to the previous theme
        this.setTheme(this.previousTheme);
      } else {
        // If opening the menu set the theme to 'dark'
        this.setTheme('dark');
      }
      this.setMenuOpen(!this.menuOpen);
    },

    initButtons() {
      gsap.set(this.$refs.closeButton.$el.firstChild, { clipPath: `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)` });
      this.displayButtons();
    },

    displayButtons() {
      const smallScreen = this.windowSize.width < BREAKPOINTS.s;
      gsap.set(this.$refs.wordmark.$el, { display: smallScreen ? 'block' : 'none' });
      if (smallScreen && this.$nuxt.$route.name === 'index') {
        gsap.set(this.$refs.logoButton.$el, { display: 'none' });
        gsap.set(this.$refs.closeChapterNavButton.$el.firstChild, { clipPath: `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)` });
        gsap.set(this.$refs.openChapterNavButton.$el, { display: 'block' });
        gsap.set(this.$refs.closeChapterNavButton.$el, { display: 'block' });
      } else {
        gsap.set(this.$refs.logoButton.$el, { display: 'block' });
        gsap.set(this.$refs.openChapterNavButton.$el, { display: 'none' });
        gsap.set(this.$refs.closeChapterNavButton.$el, { display: 'none' });
      }
    },

    onMenuButtonToggle() {
      if (this.menuOpen || this.galleryOpen) {
        gsap.fromTo(
          this.$refs.closeButton.$el.firstChild,
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1.5,
            ease: 'expo.inOut',
            onComplete: () => {
              this.animating = false;
            },
          }
        );
        gsap.fromTo(this.$refs.openChapterNavButton.$el, { autoAlpha: 1 }, { autoAlpha: 0 });
      } else {
        gsap.fromTo(
          this.$refs.closeButton.$el.firstChild,
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            duration: 1.5,
            ease: 'expo.inOut',
            onComplete: () => {
              this.animating = false;
            },
          }
        );
        gsap.fromTo(this.$refs.openChapterNavButton.$el, { autoAlpha: 0 }, { autoAlpha: 1 });
      }
    },

    toggleChapterNav() {
      if (!this.chapterNavOpen) {
        gsap.fromTo(
          this.$refs.closeChapterNavButton.$el.firstChild,
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1.5,
            ease: 'expo.inOut',
            onComplete: () => {
              this.animating = false;
            },
          }
        );
      } else {
        gsap.fromTo(
          this.$refs.closeChapterNavButton.$el.firstChild,
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            duration: 1.5,
            ease: 'expo.inOut',
            onComplete: () => {
              this.animating = false;
            },
          }
        );
      }
      this.setChapterNavOpen(!this.chapterNavOpen);
    },

    onRouteChange() {
      this.displayButtons();
    },

    onResize() {
      this.displayButtons();
    },

    ...mapActions('app', ['setMenuOpen', 'setTheme', 'setPreviousTheme', 'setVideoPlayerOpen']),
    ...mapActions('home', ['setChapterNavOpen']),
  },
};
</script>

<style lang="scss" scoped>
@import './Header';
</style>
