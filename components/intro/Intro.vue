<template>
  <div class="sectionIntro">
    <div class="content">
      <h3 v-if="subtitle" ref="subtitle" class="subtitle">{{ subtitle }}</h3>
      <h2 ref="title" class="title" v-html="title" />
      <p ref="text" class="text" v-html="text" />
    </div>

    <div v-if="galleryItems" ref="galleryItems">
      <button
        v-for="(galleryItem, id) in galleryItems"
        ref="button"
        :key="galleryItem.id"
        class="galleryItem"
        type="button"
        :aria-label="`open ${galleryItem.category} gallery album`"
        :disabled="galleryItemsDisabled"
        @click="onToggleOverlay(galleryItem)"
        @mouseenter="onMouseEnter(id)"
        @mouseleave="onMouseLeave(id)"
      >
        <div ref="galleryMask" class="galleryMask">
          <img
            ref="galleryImage"
            class="galleryImage"
            :src="galleryItem.slides[0].image.thumb.src"
            :alt="galleryItem.slides[0].image.thumb.alt"
          >
        </div>
        <Icon ref="galleryPlus" class="galleryPlus" type="Plus" />
        <Icon ref="gallerySphere" class="gallerySphere" type="Sphere" />
      </button>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'IntroComponent',

  components: {
    Icon,
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

  data() {
    return {
      galleryItemsDisabled: true,
    };
  },

  mounted() {
    this.initTl();

    this.gallerySphere = this.$el.querySelectorAll('.gallerySphere circle');
    this.galleryPlus = this.$el.querySelectorAll('.galleryPlus');
  },

  methods: {
    onToggleOverlay(item) {
      this.$root.$emit('galleryOverlay:toggle', item);
    },

    initTl() {
      this.splitSubtitle = new SplitText(
        this.$refs.subtitle,
        {
          type: 'chars',
          charsClass: 'subtitle-char',
        }
      );

      this.splitTitle = new SplitText(
        this.$refs.title,
        {
          type: 'words',
          wordsClass: 'title-word',
        }
      );

      this.splitText = new SplitText(
        this.$refs.text,
        {
          type: 'lines',
          linesClass: 'text-line',
        }
      );

      if (!this.$refs.galleryImage) return;

      gsap.to(
        this.$refs.galleryImage,
        { rotate: 360, ease: 'linear', repeat: -1, duration: 20 }
      );

      gsap.to(
        this.$refs.galleryMask,
        { rotate: -360, ease: 'linear', repeat: -1, duration: 20 }
      );
    },

    onMouseEnter(id) {
      gsap.fromTo(
        this.$refs.gallerySphere[id].$el.lastChild,
        { drawSVG: '0%', rotate: -90, transformOrigin: 'center', visibility: 'visible' },
        { drawSVG: '100%', rotate: 90, duration: 1.5, ease: 'expo.out' }
      );
    },

    onMouseLeave(id) {
      gsap.fromTo(
        this.$refs.gallerySphere[id].$el.lastChild,
        { drawSVG: '-100%', rotate: 90, transformOrigin: 'center' },
        { drawSVG: '0%', rotate: 270, duration: 1.5, ease: 'expo.out' }
      );
    },

    getEnterTl() {
      const tl = gsap.timeline();

      tl
        .fromTo(
          this.splitTitle.words,
          { autoAlpha: 0, filter: 'blur(5px)' },
          { autoAlpha: 1, filter: 'blur(0px)', stagger: 0.5, clearProps: 'filter' }, 0
        )
        .fromTo(
          this.splitText.lines,
          { autoAlpha: 0, yPercent: 50 },
          { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }, 0.5
        );
      
      if (this.$refs.galleryImage) {
        const galleryTl = gsap.timeline();

        const from = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)';
        const to = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

        galleryTl
          .set(this.$el,
            { autoAlpha: 1 }, 0
          )
          .fromTo(
            this.splitSubtitle.chars,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 1, stagger: { from: 'edges', amount: 0.5 } }, 0
          )
          .fromTo(
            this.$refs.galleryMask,
            { clipPath: from },
            { clipPath: to, duration: 2, stagger: { from: 'random', amount: 0.5 }, ease: 'expo.inOut' }, 0.5
          )
          .fromTo(
            this.gallerySphere,
            { drawSVG: '0%', rotate: -360, transformOrigin: 'center' },
            {
                drawSVG: '100%',
                rotate: 0,
                duration: 2,
                stagger: { from: 'random', amount: 0.5 },
                ease: 'expo.inOut',
                onComplete: () => {
                  this.galleryItemsDisabled = false;
                }
              }, 0.5
          )
          .fromTo(
            this.galleryPlus,
            { autoAlpha: 0, rotate: 90 },
            { autoAlpha: 1, rotate: 0, duration: 3, ease: 'expo.inOut' }, 1
          );
        
        tl.add(galleryTl, 0)
      }
    },

    getLeaveTl() {
      const tl = gsap.timeline();

      tl
        .fromTo(
          this.$el,
          { autoAlpha: 1 },
          { autoAlpha: 0 },
        );

      return tl;
    }
  },
}
</script>

<style lang="scss" scoped>
@import './Intro';
</style>