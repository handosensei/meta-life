<template>
  <FocusLock :disabled="!galleryOpen || menuOpen">
    <div class="galleryOverlay">
      <div class="content">
        <div class="head">
          <div class="title">{{ activeSlide.title }}</div>
          <div class="subtitle">{{ activeItem.category }}</div>
        </div>
        <p class="text">{{ activeSlide.text }}</p>
      </div>

      <img
        class="backgroundImage"
        :src="activeSlide.image.highres.src"
        :alt="activeSlide.image.highres.alt"
      >

      <nav class="nav">
        <button
          class="backButton"
          type="button"
          @click="toggleOverlay('')"
        >
          <Icon class="closeIcon" type="Close" />
          Back to gallery
        </button>

        <div>
          <button
            v-for="slide, index in activeItem.slides"
            :key="`${index}-${slide.title}`"
            class="navButton"
            :class="{ 'isActive': activeSlide === slide }"
            type="button"
            @click="setActiveSlide(slide)"
          >
            <img
              class="navImage"
              :src="slide.image.thumb.src"
              :alt="slide.image.thumb.alt"
            >
          </button>
        </div>
      </nav>
    </div>
  </FocusLock>
</template>

<script>
import FocusLock from 'vue-focus-lock';
import { mapActions, mapState } from 'vuex';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'GalleryOverlayComponent',

  components: {
    FocusLock,
    Icon,
  },

  props: {
    activeItem: {
      type: Object,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    toggleOverlay: {
      type: Function,
      required: true,
    },

    setActiveItem: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      activeSlide: this.activeItem.slides[0],
    };
  },

  computed: {
    ...mapState('app', ['menuOpen']),
    ...mapState('home', ['galleryOpen', 'activeSection']),
  },

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);

    this.$nuxt.$emit('assetsLoader:load', this.activeItem.slides.map(({ image }) => image.highres.src));
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    setActiveSlide(slide) {
      if (this.activeSlide === slide) {
        return;
      }

      this.activeSlide = slide;
    },

    onKeyDown({ key }) {
      if (key === 'Escape' && !this.menuOpen) {
        this.toggleOverlay('');
        this.setTheme(this.activeSection.theme);
      }

      const currentIndex = this.activeItem.slides.indexOf(this.activeSlide, 0);

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % this.activeItem.slides.length;
        const nextItem = this.activeItem.slides[nextIndex];

        this.setActiveSlide(nextItem);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        let prevIndex;
        if (currentIndex === 0) {
          prevIndex = this.items.length - 1;
        } else {
          prevIndex = currentIndex - 1;
        }
        
        const prevItem = this.activeItem.slides[prevIndex];
        this.setActiveSlide(prevItem);
      }
    },

    ...mapActions('app', ['setTheme']),
  },
}
</script>

<style lang="scss" scoped>
@import './GalleryOverlay';
</style>