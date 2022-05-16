<template>
  <div class="newsArticleFeed">
   <h1 class="title">Read more</h1>
   <div ref="slider" class="feed">
     <NuxtLink v-for="(newsElem, index) in news" :key="index" :to="`/news/${newsElem.slug}`" class="news">
        <div class="newsImg">
          <img :src="newsElem.image.thumb.src" :alt="newsElem.image.highres.src" />
        </div>
        <div class="newsInfos">
          <span class="newsType">{{ newsElem.type }}</span>
          <h1 class="newsTitle" v-html="newsElem.title" />
        </div>
     </NuxtLink>
   </div>
   <div class="buttons">
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" @click="previous">
      <circle cx="30" cy="30" r="29.5" stroke="white" stroke-opacity="0.1"/>
      <path d="M27.1343 32.2621L24.9488 30.0218H37V28.9782H24.9488L27.1343 26.7379L26.4145 26L23 29.5L26.4145 33L27.1343 32.2621Z" fill="white"/>
    </svg>
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" @click="next">
      <circle cx="30" cy="30" r="29.5" stroke="white" stroke-opacity="0.1"/>
      <path d="M32.8657 26.7379L35.0512 28.9782L23 28.9782L23 30.0218L35.0512 30.0218L32.8657 32.2621L33.5855 33L37 29.5L33.5855 26L32.8657 26.7379Z" fill="white"/>
    </svg>
   </div>
  </div>
</template>

<script>
export default {
  name: 'NewsArticleFeedComponent',

  props: {
    news: {
      type: Array,
      required: true,
    },
  },

  mounted () {
    this.elementWidth = this.$refs.slider.firstElementChild?.clientWidth
    this.index = 0
    this.$root.$on('window:resize', this.onResize);
  },

  beforeDestroy () {
    this.$root.$off('window:resize', this.onResize);
  },

  methods: {
    previous () {
      this.index += this.index > 0 ? -1 : 0
      this.$refs.slider.scrollTo(this.elementWidth * this.index, 0)
    },

    next () {
      this.index += this.index < this.news.length - 1 ? 1 : 0
      this.$refs.slider.scrollTo(this.elementWidth * this.index, 0)
    },

    onResize () {
      this.elementWidth = this.$refs.slider && this.$refs.slider.firstElementChild.clientWidth
    }
  }
}
</script>

<style lang="scss" scoped>
@import './NewsArticleFeed.scss';
</style>