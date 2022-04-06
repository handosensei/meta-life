<template>
  <nav class="menu">
    <ol class="menuList">
      <li
        v-for="{ href, text } in links"
        :key="href"
        class="menuItem"
      >
        <NuxtLink :to="href" class="menuLink">
          {{ text }}
        </NuxtLink>
      </li>
    </ol>

    <Credits class="menuCredits" />

    <div class="menuBg" />
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Credits from '~/components/credits/Credits.vue';

export default {
  name: 'MenuComponent',

  components: {
    Credits,
  },

  data() {
    return {
      links: [
        {
          href: '/',
          text: 'Metalife',
        },
        {
          href: '/news',
          text: 'News',
        },
        {
          href: '/partners',
          text: 'Partners',
        },
        {
          href: '/team',
          text: 'Team',
        },
        {
          href: '/faq',
          text: 'FAQ',
        }
      ]
    };
  },

  computed: {
    ...mapState('app', ['previousTheme']),
  },

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    onKeyDown({ key }) {
      if (key === 'Escape') {
        this.setMenuOpen(false);
        this.setTheme(this.previousTheme);
      }
    },

    ...mapActions('app', ['setMenuOpen', 'setTheme']),
  },
}
</script>

<style lang="scss" scoped>
@import './Menu';
</style>