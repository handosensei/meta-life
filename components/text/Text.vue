<template>
  <div class="u-abs text-layer">
    <div class="text" :class="positioningClass">
      <h2 ref="title" class="title" v-html="title" />
      <div v-if="text" ref="paragraph" class="paragraph" v-html="text"></div>
      <BaseButton v-if="hasPlayTrailerButton" as="button" class="textButton" text="<span>Play</span> the trailer" :on-click="onPlayTrailer" />
      <SocialButton v-if="useGallery && smallScreen" ref="button" name="Open Galery" icon="Plus" @click.native="toggleGallery"/>
      <SocialButton type="a" v-if="button" ref="button" v-bind="button"/>
    </div>

    <GalleryItems v-if="useGallery && !smallScreen" ref="galleryItems" :gallery-items="galleryItems" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { mapState } from 'vuex';

import BREAKPOINTS from '~/utils/config/breakpoints';
import SocialButton from '~/components/socialButton/SocialButton.vue';
import BaseButton from '~/components/elements/BaseButton.vue';
import GalleryItems from '~/components/galleryItems/GalleryItems.vue';

export default {
  name: 'TextComponent',

  components: {
    SocialButton,
    BaseButton,
    GalleryItems,
  },

  props: {
    galleryItems: {
      type: Array,
      required: false,
      default: () => [],
    },

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

    button: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState('app', ['windowSize']),
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

    useGallery() {
      console.log(this.galleryItems)
      return this.galleryItems && this.galleryItems.length > 0
    },

    smallScreen() {
      return this.windowSize.width < BREAKPOINTS.s
    }
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

      tl.delay(1.25)

      tl.fromTo(this.$el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })

      if (this.$refs.paragraph) {
        tl.fromTo(this.splitParagraph.lines, {
          autoAlpha: 0,
          yPercent: 50
        }, {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'expo.out'
        });
      }

      tl.fromTo(this.$refs.title, { autoAlpha: 0 }, { autoAlpha: 1 }, 0)

      console.log(this.splitTitle && this.splitTitle.length > 0)
      if (this.splitTitle && this.splitTitle.length > 0) {
        tl.fromTo(
          this.splitTitle,
          { autoAlpha: 0, filter: 'blur(5px)' },
          { autoAlpha: 1, filter: 'blur(0px)', stagger: 0.5, clearProps: 'filter' },
          0
        );
      }

      if (this.$refs.button) {
        tl.fromTo(this.$refs.button.$el,
          { autoAlpha: 0, yPercent: 50 },
          { autoAlpha: 1, yPercent: 0, duration: 1, stagger: 0.1, ease: 'expo.out' }
        , 1)
      }
      else if (this.useGallery) {
        const galleryTl = this.$refs.galleryItems.getGalleryTl();
        tl.add(galleryTl, 0);
      }else

      return tl;
    },

    getLeaveTl() {
      const tl = gsap.timeline();

      tl.fromTo(this.$el, { autoAlpha: 1 }, { autoAlpha: 0 });

      return tl;
    },

    toggleGallery() {
      this.$root.$emit('galleryOverlay:toggle', this.galleryItems[0]);
    }
  },
};
</script>

<style lang="scss" scoped>
@import './Text';
</style>
