<template>
  <div class="text" :class="positioningClass">
    <h2 ref="title" class="title" v-html="title" />
    <div v-if="text" ref="paragraph" class="paragraph" v-html="text"></div>
    <BaseButton v-if="hasPlayTrailerButton" as="button" class="textButton" text="<span>Play</span> the trailer" :on-click="onPlayTrailer" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import BaseButton from '~/components/elements/BaseButton.vue';

export default {
  name: 'TextComponent',

  components: {
    BaseButton,
  },

  props: {
    hasPlayTrailerButton: {
      type: Boolean,
      required: false,
    },

    position: {
      type: String,
      required: false,
      default: 'center top',
    },

    text: {
      type: String,
      required: false,
      default: '',
    },

    title: {
      type: String,
      required: true,
    },
  },

  computed: {
    positioningClass() {
      const CLASS = {
        'center top': 'positionCenterTop',
        'right top': 'positionRightTop',
        'left bottom': 'positionLeftBottom',
        'left center': 'positionLeftCenter',
        'right center': 'positionRightCenter',
      };

      return CLASS[this.position];
    },
  },

  mounted() {
    this.initTl();
  },

  methods: {
    initTl() {
      this.splitTitle = this.$refs.title.querySelectorAll('span');

      this.splitParagraph = new SplitText(this.$refs.paragraph, {
        type: 'lines',
        linesClass: 'paragraph-line',
      });
    },

    onPlayTrailer() {
      this.$root.$emit('trailerPreview:toggleVideoPlayer');
    },

    getEnterTl() {
      const tl = gsap.timeline();

      if (this.$refs.paragraph) {
        gsap.fromTo(this.splitParagraph.lines, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, delay: 0.5, duration: 1, stagger: 0.1, ease: 'expo.out' });
      }

      tl.fromTo(this.$refs.title, { autoAlpha: 0 }, { autoAlpha: 1 }, 0).fromTo(
        this.splitTitle,
        { autoAlpha: 0, filter: 'blur(5px)' },
        { autoAlpha: 1, filter: 'blur(0px)', stagger: 0.5, clearProps: 'filter' },
        0
      );

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
@import './Text';
</style>
