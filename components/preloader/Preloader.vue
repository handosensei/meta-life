<template>
  <div class="preloader">
    <div ref="container" class="container">
      <Icon ref="preloaderLogo" type="PreloaderLogo" class="preloaderLogo" />

      <div ref="transform" class="transform">
        <p ref="title" class="title">Enter in the new world</p>
        <Icon ref="wordmark" type="wordmark" class="wordmark" />
        <div ref="button" class="preloader-button" @click="onClick">
          <svg width="205" height="61" viewBox="0 0 205 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 1.34315 1.34315 0 3 0H202C203.657 0 205 1.34315 205 3V50L199.003 55.5L193.005 61H2.99999C1.34314 61 0 59.6569 0 58V3Z" fill="white"/>
          </svg>
          <div>
            <span>Launch the experience</span>
          </div>
        </div>
      </div>

      <div ref="progress" class="progress">
        <div ref="progressCount" class="progressCount">0%</div>
        <Icon ref="preloaderProgress" type="PreloaderProgress" class="preloaderProgress" />
      </div>

      <Icon ref="logoOutline" type="LogoOutline" class="logoOutline" />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import VirtualScroll from 'virtual-scroll';
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
    };

    gsap.to(progress, {
      delay: 0.5,
      duration: 2, // TEMP: set duration equal to duration of enter animation
      value: progress.end,
      onUpdate: () => this.updateProgress(progress.value),
      onComplete: this.onLoaded,
    });
  },

  methods: {
    initTl() {
      this.splitSubtitle = new SplitText(this.$refs.title, {
        type: 'chars',
        charsClass: 'subtitle-char',
      });

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

    onLoaded() {
      gsap
        .timeline({
          paused: true,
          onComplete: () => {
            this.vs = new VirtualScroll();
            this.vs.on(this.onScroll);
          },
        })
        .to([this.preloaderLogo, this.$refs.progress], {
          autoAlpha: 0,
          duration: 0.4,
          ease: 'none',
        })
        .to(this.$refs.transform, {
          y: -85,
          duration: 1.2,
          ease: 'expo.inOut',
        })
        .to(
          this.logoOutline,
          {
            autoAlpha: 0,
            duration: 0.4,
            ease: 'none',
          },
          '-=0.5'
        )
        .to(this.$refs.button, {
          autoAlpha: 1,
          duration: 0.4,
          ease: 'none',
        })
        .restart();
    },

    onClick() {
      this.vs.destroy();
      this.setHasPreloader(false);
    },

    enter() {
      const enterTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      const from = `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`;
      const to = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%`;

      enterTl
        .set(this.$refs.container, { autoAlpha: 1 }, 0)
        .fromTo(this.logoOutline.children, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, delay: 1, ease: 'linear' }, 0)
        .fromTo(this.preloaderLogo.children[0], { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, delay: 1 }, 0)
        .fromTo(this.preloaderLogo.children, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, delay: 0.5, stagger: { from: 'edges', amount: 0.1 } }, 0)
        .fromTo(this.wordmarChars.slice(0, 4), { yPercent: -120 }, { yPercent: 0, duration: 1, delay: 0.5, stagger: { from: 'start', amount: 0.5 } }, 0.5)
        .fromTo(this.wordmarChars.slice(4, 8), { yPercent: 120 }, { yPercent: 0, duration: 1, delay: 0.5, stagger: { from: 'start', amount: 0.5 } }, 0.5)
        .fromTo(this.preloaderProgress.children[0], { clipPath: from }, { clipPath: to, duration: 2, ease: 'linear' }, 0.5)
        .fromTo(this.preloaderProgress.children[1], { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 }, 0)
        .fromTo(this.splitSubtitle.chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: { from: 'edges', amount: 0.5 } }, 0.5);
    },

    leave(done) {
      gsap.to(this.$el, {
        autoAlpha: 0,
        delay: 0.5,
        onComplete: () => {
          this.setAssetsPreloaded();
          this.setPreloaderVisible(false);
          done();
        },
      });
    },

    ...mapActions('app', ['setAssetsPreloaded', 'setHasPreloader', 'setPreloaderVisible']),
  },
};
</script>

<style lang="scss" scoped>
@import './Preloader';
</style>
