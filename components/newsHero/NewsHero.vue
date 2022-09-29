<template>
  <div class="newsHero">
    <h1 class="newsTitle">The latest news from the <span class="purple">MetaLife</span> and beyond.</h1>

    <NewsFilter :categories="categories" :select-category="selectCategory" />
  </div>
</template>

<script>
import NewsFilter from '~/components/newsFilter/NewsFilter.vue';

export default {
  name: 'NewsHeroComponent',

  components: {
    NewsFilter,
  },

  props: {
    categories: {
      type: Array,
      required: true,
    },

    selectCategory: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import './NewsHero';
</style>
