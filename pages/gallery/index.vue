<template>
  <main class="isDark">
    <GalleryList />
  </main>
</template>

<script>
import { mapActions } from 'vuex';
import GalleryList from '~/components/galleryList/GalleryList.vue';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import SEO from '~/mixins/seo';

export default {
  name: 'GalleryPage',
  components: {
    GalleryList,
  },
  mixins: [Debug, PageTransition, SEO],
  mounted() {
    this.setTheme('dark');
  },
  methods: {
    ...mapActions('app', ['setTheme']),
  },
};
</script>
