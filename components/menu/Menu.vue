<template>
  <nav class="menu">
    <div class="content">
      <div ref="title" class="title">The Future will be here soon</div>
      <ul ref="menuList" class="menuList">
        <li v-for="{ href, text, internal } in links" :key="href" class="menuItem">
          <NuxtLink v-if="internal" :to="href" class="menuLink">
            {{ text }}
          </NuxtLink>
          <a v-else :href="href" target="_blank" class="menuLink">
            {{ text }}
          </a>
        </li>
      </ul>
    </div>

    <Credits class="menuCredits" />

    <div class="menuBg" />
  </nav>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
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
        { href: '/', text: 'Home', internal: true },
        { href: '/news', text: 'News', internal: true },
        { href: '/team', text: 'Team', internal: true },
        { href: '/contact', text: 'Contact', internal: true },
        { href: 'https://google.com/?', text: 'Tokenomics', internal: false },
        { href: 'https://google.com', text: 'Newsletter', internal: false },
        { href: '/privacy-policy', text: 'Privacy Policy', internal: true },
        { href: '/terms-conditions', text: 'Terms & Conditions', internal: true },
      ],
    };
  },

  computed: {
    ...mapState('app', ['previousTheme', 'windowSize']),
  },

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);

    this.init();
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

    init() {
      this.splitTitle = new SplitText(this.$refs.title, { type: 'words' });
    },

    enter() {
      const from = `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`;
      const to = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%`;

      gsap.fromTo(this.$el, { clipPath: from }, { clipPath: to, duration: this.$root.menuTransitionDuration / 1000, ease: 'expo.inOut', clearProps: 'all' });

      gsap.fromTo(this.splitTitle.words, { autoAlpha: 0, filter: 'blur(5px)' }, { autoAlpha: 1, filter: 'blur(0px)', stagger: { from: 'random', amount: 0.5 }, delay: 1, clearProps: 'filter' });

      gsap.fromTo(this.$refs.menuList.children, { autoAlpha: 0 }, { autoAlpha: 1, stagger: { from: 'center', amount: 0.5 }, delay: 1, clearProps: 'all' });
    },

    leave(done) {
      const from = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%`;
      const to = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';

      gsap.fromTo(this.$el, { clipPath: from }, { clipPath: to, duration: this.$root.menuTransitionDuration / 1000, ease: 'expo.inOut', onComplete: done });
    },

    ...mapActions('app', ['setMenuOpen', 'setTheme']),
  },
};
</script>

<style lang="scss" scoped>
@import './Menu';
</style>
