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

// import data from '~/content/newsArticle.json';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import Scroll from '~/mixins/scroll';
import SEO from '~/mixins/seo';

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

  mixins: [Debug, PageTransition, Scroll, SEO],

  async asyncData ({ query, params, $datocmsClient }) {
    try {
      const preview =
        query && query.preview === '1' && query.secret === process.env.CMS_DATOCMS_PREVIEW_TOKEN
      const data = await $datocmsClient.getPage({ name: 'newsArticle', variables: {slug: params.id}, preview })
      return data
    } catch (e) {
      console.log(e)
      return e
    }
  },

  head () {
    const seo = this.$store.state.app.settings.site
    return this.$getPageMeta({
      seo,
      type: 'news',
      news: this.article
    })
  },

  beforeMount() {
    this.setTheme('dark');
  },

  methods: {
    ...mapActions('app', ['setTheme']),
  },
};
</script>