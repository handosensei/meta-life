<template>
  <div class="sectionHeading">
    <h2 class="heading" :class="{ isLarge: size === 'large' }" v-html="title" />
    <div v-if="text" ref="paragraph" class="paragraph" v-html="text"></div>
    <div class="buttons">
      <div v-for="(link, index) in links" :key="index">
        <SocialButton  :href="link.href" :name="link.text" :icon="link.icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import SocialButton from '~/components/socialButton/SocialButton.vue';

export default {
  name: 'HeadingComponent',

  components: {
    SocialButton,
  },

  props: {
    size: {
      type: String,
      required: false,
      default: 'small',
      validator: (value) => ['small', 'large'].includes(value),
    },

    title: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: false,
      default: '',
    },

    links: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  mounted() {
    this.initTl();
  },

  methods: {
    initTl() {
      this.splitParagraph = new SplitText(this.$refs.paragraph, {
        type: 'lines',
        linesClass: 'paragraph-line',
      });
    },

    getEnterTl() {
      const tl = gsap.timeline();

      if (this.$refs.paragraph) {
        tl.fromTo(this.splitParagraph.lines, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, delay: 0.5, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0);
      }

      tl.fromTo(this.$el, { autoAlpha: 0 }, { autoAlpha: 1 }, 0);

      return tl;
    },

    getLeaveTl() {
      const tl = gsap.timeline();

      tl.fromTo(this.$el, { autoAlpha: 1 }, { autoAlpha: 0 });

      return tl;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Heading';
</style>
