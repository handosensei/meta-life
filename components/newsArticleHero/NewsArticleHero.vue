<template>
  <div class="newsHero">
    <div class="newsBackground">
      <img :src="article.img" alt="" data-fx="y" data-speed="0.5"/>
    </div>
    <div class="newsTitle">
      <span class="newsType">{{ article.type }}</span>
      <h1 v-html="article.title" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsArticleHeroComponent',

  props: {
    article: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import './NewsArticleHero.scss';
</style>
