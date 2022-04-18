<template>
  <div class="preloader">
    <Icon ref="preloaderLogo" type="PreloaderLogo" class="preloaderLogo" />

    <p ref="title" class="title">
      Enter in the new world
    </p>
    
    <Icon ref="wordmark" type="wordmark" class="wordmark" />

    <div class="progress">
      <div ref="progressCount" class="progressCount">0%</div>
      <Icon ref="preloaderProgress" type="PreloaderProgress" class="preloaderProgress" />
    </div>

    <Icon ref="logoOutline" type="LogoOutline" class="logoOutline" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
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
    this.initTl();

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
    initTl() {
      this.splitSubtitle = new SplitText(
        this.$refs.title,
        {
          type: 'chars',
          charsClass: 'subtitle-char',
        }
      );

      this.wordmark = this.$refs.wordmark.$el;
      this.wordmarChars = Array.prototype.slice.call(this.wordmark.children);

      this.logoOutline = this.$refs.logoOutline.$el;

      this.preloaderLogo = this.$refs.preloaderLogo.$el;
      this.preloaderProgress = this.$refs.preloaderProgress.$el;
    },
    
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
      const enterTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      const from = `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`;
      const to = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%`;

      enterTl
        .fromTo(
          this.logoOutline.children,
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: 2, delay: 1, ease: 'linear' }, 0
        )
        .fromTo(
          this.preloaderLogo.children[0],
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: 1, delay: 1 }, 0
        )
        .fromTo(
          this.preloaderLogo.children,
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, delay: 0.5, stagger: { from: 'edges', amount: 0.1 } }, 0
        )
        .fromTo(
          this.wordmarChars.slice(0, 4),
          { yPercent: -120 },
          { yPercent: 0, duration: 1, delay: 0.5, stagger: { from: 'start', amount: 0.5 } }, 0
        )
        .fromTo(
          this.wordmarChars.slice(4, 8),
          { yPercent: 120 },
          { yPercent: 0, duration: 1, delay: 0.5, stagger: { from: 'start', amount: 0.5 } }, 0
        )
        .fromTo(
          this.preloaderProgress.children[0],
          { clipPath: from },
          { clipPath: to, duration: 2, ease: 'linear' }, 0
        )
        .fromTo(
          this.splitSubtitle.chars,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1, stagger: { from: 'edges', amount: 0.5 } }, 0
        );
    },

    leave(done) {
      this.setPreloaderVisible(false);

      gsap.to(this.$el, { autoAlpha: 0, onComplete: done, delay: 0.5 } );
    },

    ...mapActions('app', ['setAssetsPreloaded', 'setPreloaderVisible']),
  },
}
</script>

<style lang="scss" scoped>
@import './Preloader';
</style>