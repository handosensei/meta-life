<template>
  <div class="newsArticle">
    <div class="date">
      <span>Date: {{ date }}</span>
    </div>
    <div v-for="(section, index) in article.sections" :key="index" class="section">
      <h2 v-if="section.title" class="title">{{ section.title }}</h2>
      <div v-if="section.content" class="content" v-html="section.content" />
      <template v-if="section.image">
        <div class="articleImg">
          <img :src="section.image.src" :alt="section.image.alt && section.image.alt" />
        </div>
      </template>
    </div>
    <div class="section share">
      <span class="shareTitle">Share this news on:</span>
      <div class="buttons">
        <SocialButton :name="discordText" icon="discord" @click.native="shareOnDiscord" />
        <SocialButton target="_blank" :href="`https://twitter.com/intent/tweet?text=${path}`" name="Twitter" icon="twitter" />
        <SocialButton :name="instagramText" icon="instagram" @click.native="shareOnInstagram" />
      </div>
    </div>
  </div>
</template>

<script>
import SocialButton from '~/components/socialButton/SocialButton.vue';

export default {
  name: 'NewsArticleComponent',

  components: {
    SocialButton,
  },

  props: {
    article: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    discordText: 'Discord',
    instagramText: 'Instagram',
  }),

  computed: {
    date() {
      const date = new Date(this.article._firstPublishedAt);
      return date.toLocaleDateString();
    },
    path() {
      if (process.client) {
        return location.href;
      }
      return '';
    },
  },

  methods: {
    shareOnDiscord() {
      navigator.clipboard.writeText(this.path);
      this.discordText = 'Copied to Clipboard';

      setTimeout(() => {
        window.open('https://discord.com', '_blank').focus();
        this.discordText = 'Discord';
      }, 1500);
    },
    shareOnInstagram() {
      navigator.clipboard.writeText(this.path);
      this.instagramText = 'Copied to Clipboard';

      setTimeout(() => {
        window.open('https://www.instagram.com', '_blank').focus();
        this.instagramText = 'Instagram';
      }, 1500);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './NewsArticle.scss';
</style>
