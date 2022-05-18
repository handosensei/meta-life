<template>
  <main class="page">
    <div ref="bounding" class="bounding">
      <NewsHero :categories="categories" :select-category="selectCategory" data-section />
      <NewsGrid :items="activeItems" data-section />
      <BackToExperience data-section />
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import Scroll from '~/mixins/scroll';
import SEO from '~/mixins/seo';

import BackToExperience from '~/components/backToExperience/BackToExperience.vue';
import NewsGrid from '~/components/newsGrid/NewsGrid.vue';
import NewsHero from '~/components/newsHero/NewsHero.vue';

export default {
  name: 'NewsPage',

  components: {
    BackToExperience,
    NewsGrid,
    NewsHero,
  },

  mixins: [Debug, PageTransition, Scroll, SEO],

  async asyncData ({ query, $datocmsClient }) {
    try {
      const preview =
        query && query.preview === '1' && query.secret === process.env.CMS_DATOCMS_PREVIEW_TOKEN;
      const {news: items, categories} = await $datocmsClient.getPage({ name: 'news', preview });
      return {
        items,
        categories
      }
    } catch (e) {
      console.log(e)
      return e
    }
  },

  data() {
    return {
      activeCategory: '',
      activeItems: [],
    };
  },

  beforeMount() {
    this.activeCategory = this.categories[0];
    this.activeItems = this.items;
  },

  methods: {
    selectCategory(category) {
      this.activeCategory = category;
      if(this.activeCategory) {
        this.activeItems = this.items.filter((item) => item.categories.find(category => category.name === this.activeCategory));
      }
      else {
        this.activeItems = this.items;
      }
    },


    ...mapActions('app', ['setTheme']),
  },
};
</script>
