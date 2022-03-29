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

    <Icon class="menuLogo" type="MetaLegends" />

    <div class="menuSub">
      visit : <a class="menuSubLink" href="https://metalegends.com" target="_blank" rel="noreferrer">metalegends.com</a>
    </div>

    <div class="menuBg" />
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'MenuComponent',

  components: {
    Icon,
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