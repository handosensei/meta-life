<template>
  <div class="sectionHeading">
    <h2 class="heading" :class="{ isLarge: size === 'large' }" v-html="title" />
    <div v-if="text" ref="paragraph" class="paragraph" v-html="text"></div>
    <div class="buttons">
      <div v-for="(link, index) in links" :key="index">
        <a :href="link.href" class="button">
          <svg width="147" height="61" viewBox="0 0 147 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.144531 3C0.144531 1.34315 1.48768 0 3.14453 0H143.357C145.014 0 146.357 1.34315 146.357 3V50L141.501 55.5L136.645 61H3.14453C1.48768 61 0.144531 59.6569 0.144531 58V3Z"
              fill="white"
            />
            <path
              d="M0.644531 3C0.644531 1.61929 1.76382 0.5 3.14453 0.5H143.357C144.738 0.5 145.857 1.61929 145.857 3V49.8108L141.126 55.1691L136.419 60.5H3.14453C1.76382 60.5 0.644531 59.3807 0.644531 58V3Z"
              stroke="black"
              stroke-opacity="0.1"
            />
          </svg>
          <div>
            <Icon :type="link.icon" class="icon" />
            <span>{{ link.text }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'HeadingComponent',

  components: {
    Icon,
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
