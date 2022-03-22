<template>
  <main>
    <NewsHero :title="title" :categories="categories" :select-category="selectCategory" />
    <NewsGrid :items="activeItems" />
    <BackToExperience />
  </main>
</template>

<script>
import data from '~/content/news.json';

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
  },

  methods: {
    selectCategory(category) {
      this.activeCategory = category;

      if (category === '') {
        this.activeItems = this.items;        
      } else {
        this.activeItems = this.items.filter((item) => item.category === category);
      }
    }
  }
}
</script>