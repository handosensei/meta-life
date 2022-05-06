<template>
  <div class="sectionIntro">
    <div class="content">
      <h3 v-if="subtitle" ref="subtitle" class="subtitle">{{ subtitle }}</h3>
      <h2 ref="title" class="title" v-html="title" />
      <p ref="text" class="text" v-html="text" />
    </div>

    <GalleryItems v-if="galleryItems && galleryItems.length > 0" ref="galleryItems" :gallery-items="galleryItems" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import GalleryItems from '~/components/GalleryItems/GalleryItems.vue';

export default {
  name: 'IntroComponent',

  components: {
    GalleryItems,
  },

  props: {
    galleryItems: {
      type: Array,
      required: false,
      default: () => [],
    },

    subtitle: {
      type: String,
      required: false,
      default: '',
    },

    text: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  },

  mounted() {
    this.initTl();
  },

  methods: {
    initTl() {
      if (this.subtitle) {
        this.splitSubtitle = new SplitText(this.$refs.subtitle, {
          type: 'chars',
          charsClass: 'subtitle-char',
        });
      }

      this.splitTitle = new SplitText(this.$refs.title, {
        type: 'words',
        wordsClass: 'title-word',
      });

      this.splitText = new SplitText(this.$refs.text, {
        type: 'lines',
        linesClass: 'text-line',
      });
    },

    getEnterTl() {
      const tl = gsap.timeline();

      if (this.subtitle) {
        tl.fromTo(this.splitSubtitle.chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, stagger: { from: 'edges', amount: 0.5 } }, 0);
      }

      tl.set(this.$el, { autoAlpha: 1 }, 0)
        .fromTo(this.splitTitle.words, { autoAlpha: 0, filter: 'blur(5px)' }, { autoAlpha: 1, filter: 'blur(0px)', stagger: 0.5, clearProps: 'filter' }, 0)
        .fromTo(this.splitText.lines, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.5);

      if (this.galleryItems && this.galleryItems.length > 0) {
        const galleryTl = this.$refs.galleryItems.getGalleryTl();
        tl.add(galleryTl, 0);
      }

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
@import './Intro';
</style>
