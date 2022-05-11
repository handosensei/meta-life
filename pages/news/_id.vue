<template>
  <main class="page">
    <div ref="bounding" class="bounding">
      <NewsArticleHero :article="article" data-section />
      <NewsArticle :article="article" data-section />
      <NewsArticleFeed :news="news" data-section />
      <BackToExperience data-section /> 
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex';

import data from '~/content/newsArticle.json';
import dataNews from '~/content/news.json';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import Scroll from '~/mixins/scroll';

import BackToExperience from '~/components/backToExperience/BackToExperience.vue';
import NewsArticle from '~/components/newsArticle/NewsArticle.vue';
import NewsArticleHero from '~/components/newsArticleHero/NewsArticleHero.vue';
import NewsArticleFeed from '~/components/newsArticleFeed/NewsArticleFeed.vue';


export default {
  name: 'NewsPage',

  components: {
    BackToExperience,
    NewsArticle,
    NewsArticleHero,
    NewsArticleFeed,
  },

  mixins: [Debug, PageTransition, Scroll],

  async asyncData ({ params }) {
    const article = await new Promise(resolve =>
      resolve(data.find(article => article.slug === params.id))
    )
    return {
      article
    }
  },

  data() {
    return {
      ...data,
      news: dataNews.items
    };
  },

  beforeMount() {
    this.setTheme('dark');
  },

  methods: {
    ...mapActions('app', ['setTheme']),
  },
};
</script>