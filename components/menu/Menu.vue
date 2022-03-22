<template>
  <nav class="menu">
    <ul>
      <li
        v-for="{ href, text } in links"
        :key="href"
      >
        <NuxtLink :to="href">{{ text }}</NuxtLink>
      </li>
    </ul>

    <Icon type="MetaLegends" />

    <div>
      Visit <a href="https://metalegends.com" target="_blank" rel="noreferrer">metalegends.com</a>
    </div>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';

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
      }
    },

    ...mapActions('app', ['setMenuOpen']),
  },
}
</script>

<style lang="scss" scoped>
@import './Menu';
</style>