<template>
  <main class="page">
    <div ref="bounding" class="bounding">
      <Contact />
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex';
import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import Scroll from '~/mixins/scroll';
import SEO from '~/mixins/seo';
import Contact from '~/components/contact/Contact.vue';

export default {
  name: 'ContactPage',

  components: {
    Contact,
  },

  mixins: [Debug, PageTransition, Scroll, SEO],

  beforeMount() {
    this.setTheme('dark');
  },

  methods: {
    ...mapActions('app', ['setTheme']),
  },
};
</script>
