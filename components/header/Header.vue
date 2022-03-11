<template>
  <header class="header" :class="{ 'isDark': theme === 'light' }">
    <IconButton icon="Burger" :on-click="() => {}" />
    <IconButton icon="Logo" :on-click="() => {}" />
  </header>
</template>

<script>
import { mapState } from 'vuex';

import IconButton from '~/components/elements/IconButton.vue';

export default {
  name: 'HeaderComponent',

  components: {
    IconButton,
  },

  computed: {
    ...mapState('app', ['theme']),
  }
}
</script>

<style lang="scss" scoped>
@import './Header';
</style>