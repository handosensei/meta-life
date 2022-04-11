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

    <Icon type="LogoOutline" class="logoOutline" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import homeData from '~/content/home.json';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'PreloaderComponent',

  components: {
    Icon,
  },

  data() {
    return {
      skipIntro: false,
    };
  },

  computed: {
    ...mapState('app', ['introSkipped']),
  },

  created() {
    if (this.introSkipped) {
      this.setAssetsPreloaded();
      this.setPreloaderVisible(false);
    }
  },

  mounted() {
    this.preloadGalleryThumbs();

    if (!this.introSkipped) {
      this.enter();
    }

    const progress = {
      value: 0,
      end: 100,
    }

    gsap.to(
      progress,
      {
        duration: 2, // TEMP: set duration equal to duration of enter animation
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

    enter() {
      
    },

    leave(done) {
      this.setPreloaderVisible(false);
      done();
    },

    ...mapActions('app', ['setAssetsPreloaded', 'setPreloaderVisible']),
  },
}
</script>

<style lang="scss" scoped>
@import './Preloader';
</style>