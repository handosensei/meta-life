<template>
  <div class="backToExperience" :class="{ isLight: theme === 'light' }">
    <div ref="container" class="container">
      <NuxtLink to="/" class="link">
        <span class="link-line">Back to the</span>
        <span class="link-line">Experience</span>
      </NuxtLink>
      <Icon type="LogoOutline" class="logoOutline" />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapState } from 'vuex';

import { inview } from '~/utils/functions/inview';
import { progress } from '~/utils/functions/math';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'BackToExperienceComponent',

  components: {
    Icon,
  },

  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
  },

  computed: {
    ...mapState('app', ['windowSize']),
  },

  mounted() {
    this.$nuxt.$on('window:raf', this.onRaf);
    this.$nuxt.$on('window:resize', this.onResize);

    this.setAnimation();
  },

  beforeDestroy() {
    this.$nuxt.$off('window:raf', this.onRaf);
    this.$nuxt.$off('window:resize', this.onResize);
  },

  methods: {
    onRaf() {
      if (inview(this.$el, this.windowSize.height, 0)) {
        this.setProgress();
      }
    },

    onResize() {
      this.setAnimation();
    },

    setProgress() {
      const bounds = this.$el.getBoundingClientRect();

      const value = bounds.top - this.windowSize.height;
      const max = bounds.height;

      this.progress = progress(value, 0, max);
      this.scrollTl.progress(-this.progress);
    },

    setAnimation() {
      const bounds = this.$el.getBoundingClientRect();

      this.scrollTl = gsap.timeline({ paused: true });
      this.scrollTl.fromTo(this.$refs.container, { y: -bounds.height / 2 }, { y: 0, ease: 'linear' });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './BackToExperience';
</style>
