<template>
  <div class="newsArticle">
    <div class="date">
      <span>Date: {{ article.date }}</span>
    </div>
    <div v-for="(section, index) in article.sections" :key="index" class="section">
      <template v-if="section.title">
        <h2 class="title">{{section.title}}</h2>
        <p v-for="(content, indexC) in section.contents" :key="indexC" class="content">
          {{ content }}
        </p>
      </template>
      <template v-if="section.img">
        <div class="articleImg">
          <img :src="section.img" :alt="section.alt" />
        </div>
      </template>
    </div>
    <div class="section share">
      <span class="shareTitle">Share this news on:</span>
      <div class="buttons">
        <SocialButton href="#" name="Discord" icon="discord" />
        <SocialButton href="#" name="Twitter" icon="twitter" />
        <SocialButton href="#" name="Instagram" icon="instagram" />
      </div>
    </div>
  </div>
</template>

<script>
import SocialButton from '~/components/socialButton/SocialButton.vue'

export default {
  name: 'NewsArticleComponent',

  components: {
    SocialButton
  },

  props: {
    article: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import './NewsArticle.scss';
</style>