<template>
  <header class="header" :class="{ 'isDark': theme === 'light', 'menuOpen': menuOpen }">
    <IconButton
      class="menuButton"
      :filled="menuOpen || videoPlayerOpen"
      icon="Burger"
      :on-click="onMenuButtonClick"
    />
    <IconButton
      v-if="!videoPlayerOpen"
      class="logoButton"
      icon="Logo"
      :on-click="() => {}"
    />
  </header>
</template>

<script>
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

    ...mapActions('app', ['setMenuOpen', 'setTheme', 'setPreviousTheme', 'setVideoPlayerOpen']),
  }
}
</script>

<style lang="scss" scoped>
@import './Header';
</style>