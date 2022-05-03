<template>
  <div class="newsHero">
    <h1 class="newsTitle" v-html="title" />

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
    title: {
      type: String,
      required: true,
    },

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
