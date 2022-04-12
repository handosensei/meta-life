<template>
  <main class="page">
    <div ref="bounding" class="bounding">
      <NewsHero :title="title" :categories="categories" :select-category="selectCategory" data-section />
      <NewsGrid :items="activeItems" data-section />
      <BackToExperience data-section />
    </div>
  </main>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions } from 'vuex';

import data from '~/content/news.json';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import Scroll from '~/mixins/scroll';

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

  mixins: [Debug, PageTransition, Scroll],

  data() {
    return {
      ...data,

      activeCategory: '',
      activeItems: [],
    };
  },

  computed: {
    categories() {
      return [...new Set(this.items.flatMap(({ category }) => category))];
    }
  },

  beforeMount() {
    this.activeCategory = this.categories[0];
    this.activeItems = this.items;
    this.setTheme('light');
  },

  methods: {
    selectCategory(category) {
      this.activeCategory = category;

      if (category === '') {
        this.activeItems = this.items;        
      } else {
        this.activeItems = this.items.filter((item) => item.category === category);
      }
    },

    ...mapActions('app', ['setTheme']),
  }
}
</script>