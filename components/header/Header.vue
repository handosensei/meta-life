<template>
  <header class="header" :class="{ 'isDark': theme === 'light', 'menuOpen': menuOpen }">
    <IconButton
      class="menuButton"
      :filled="menuOpen"
      icon="Burger"
      :on-click="toggleMenu"
    />
    <IconButton
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

  data() {
    return {
      prevTheme: '',
    };
  },

  computed: {
    ...mapState('app', ['theme', 'previousTheme', 'menuOpen']),
  },

  methods: {
    toggleMenu() {
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

    ...mapActions('app', ['setMenuOpen', 'setTheme', 'setPreviousTheme']),
  }
}
</script>

<style lang="scss" scoped>
@import './Header';
</style>