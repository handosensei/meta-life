<template>
  <div class="preloader">
    <Icon type="PreloaderLogo" class="preloaderLogo" />

    <p class="title">
      Enter in the new world
    </p>
    
    <Icon type="wordmark" class="wordmark" />

    <div class="progress">
      <div ref="progressCount" class="progressCount">0%</div>
      <Icon type="PreloaderProgress" class="preloaderProgress" />
    </div>

    <Icon type="PreloaderShape" class="preloaderShape" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions } from 'vuex';

import homeData from '~/content/home.json';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'PreloaderComponent',

  components: {
    Icon,
  },

  created() {
    const { skipIntro } = this.$router.history.current.query;

    if (skipIntro) {
      this.setAssetsPreloaded();
    }
  },

  mounted() {
    this.preloadGalleryThumbs();

    const progress = {
      value: 0,
      end: 100,
    }

    gsap.to(
      progress,
      {
        duration: 2,
        value: progress.end,
        onUpdate: () => this.updateProgress(progress.value),
        onComplete: this.setAssetsPreloaded
      },
    );
  },

  methods: {
    preloadGalleryThumbs() {
      // Preload gallery thumbnails
      const galleryThumbs = homeData.chapters
        .flatMap(({ sections }) => sections)
        .filter(({ component }) => component.name === 'SectionGallery')
        .flatMap(({ component }) => component.items)
        .flatMap(({ slides }) => slides[0])
        .map(({ image }) => image.thumb.src);
      this.$nuxt.$emit('assetsLoader:load', galleryThumbs);
    },

    updateProgress(value) {
      this.$refs.progressCount.innerHTML = `${value.toFixed()}%`;
    },

    ...mapActions('app', ['setAssetsPreloaded']),
  },
}
</script>

<style lang="scss" scoped>
@import './Preloader';
</style>