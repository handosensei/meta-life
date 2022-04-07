<template>
  <header class="header" :class="{ 'isDark': theme === 'light', 'menuOpen': menuOpen }">
    <IconButton
      ref="menuButton"
      class="menuButton"
      icon="MenuButton"
      :on-click="onMenuButtonClick"
    />
    <IconButton
      ref="closeButton"
      class="closeButton"
      icon="CloseButton"
      :on-click="onMenuButtonClick"
    />
    <IconButton
      v-if="!videoPlayerOpen"
      class="logoButton"
      icon="LogoButton"
      :on-click="() => {}"
    />
  </header>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import IconButton from '~/components/elements/IconButton.vue';

export default {
  name: 'HeaderComponent',

  components: {
    IconButton,
  },

  computed: {
    ...mapState('app', ['theme', 'previousTheme', 'menuOpen', 'videoPlayerOpen']),
  },

  watch: {
    menuOpen: 'onMenuButtonToggle',
    galleryOpen: 'onMenuButtonToggle',
  },

  mounted() {
    this.initCloseButton();
  },

  methods: {
    onMenuButtonClick() {
      // Close video player if open and return
      if (this.videoPlayerOpen) {
        this.setVideoPlayerOpen(false);

        return;
      }

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

      this.setMenuOpen(!this.menuOpen)
    },

    initCloseButton() {
      gsap.set(
        this.$refs.closeButton.$el,
        { clipPath: `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)` }
      );
    },

    onMenuButtonToggle() {
      if (this.menuOpen || this.galleryOpen) {
        gsap.fromTo(
          this.$refs.closeButton.$el,
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%', duration: 1.5, ease: 'expo.inOut' },
        );
      } else {
        gsap.fromTo(
          this.$refs.closeButton.$el,
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%' },
          { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', duration: 1.5, ease: 'expo.inOut' },
        );
      }
    },

    ...mapActions('app', ['setMenuOpen', 'setTheme', 'setPreviousTheme', 'setVideoPlayerOpen']),
  }
}
</script>

<style lang="scss" scoped>
@import './Header';
</style>