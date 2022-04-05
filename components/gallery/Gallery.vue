<template>
  <div class="gallery">
    <h2 class="title">{{ title }}</h2>

    <div class="items">
      <button
        v-for="item in items"
        :key="item.id"
        class="item"
        type="button"
        @click="toggleOverlay(item)"
      >
        <!-- <NuxtPicture class="image" :src="item.slides[0].image.thumb.src" :alt="item.slides[0].image.thumb.alt" /> -->
        <img class="image" :src="item.slides[0].image.thumb.src" :alt="item.slides[0].image.thumb.alt">
        <h3 class="category">
          {{ item.category }}
        </h3>
      </button>
    </div>

    <transition
      name="galleryOverlayTransition"
      :css="false"
      @enter="onEnterGalleryOverlay"
      @leave="onLeaveGalleryOverlay"
    >
      <GalleryOverlay
        v-if="galleryOpen"
        :active-item="activeItem"
        :items="items"
        :set-active-item="setActiveItem"
        :toggle-overlay="toggleOverlay"
      />
    </transition>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import GalleryOverlay from '~/components/galleryOverlay/GalleryOverlay.vue';

export default {
  name: 'GalleryComponent',

  components: {
    GalleryOverlay,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      activeItem: null,
    };
  },

  computed: {
    ...mapState('home', ['galleryOpen', 'activeSection']),
  },

  created() {
    this.preloadGalleryThumbs();
  },

  methods: {
    preloadGalleryThumbs() {
      const galleryThumbs = this.items
        .flatMap((item) => {
          return item.slides.flatMap(({ image }, index) => {
            if (index > 0) return image.thumb.src;
            return null;
          })
        })
        .filter((x) => !!x);

      this.$nuxt.$emit('assetsLoader:load', galleryThumbs);
    },

    setActiveItem(item) {
      if (item === this.activeItem) {
        return;
      }

      this.activeItem = item;
    },
    
    toggleOverlay(item) {
      this.activeItem = item;
      this.setGalleryOpen(!this.galleryOpen);

      if (this.galleryOpen) {
        this.setTheme('dark');
      } else {
        this.setTheme(this.activeSection.theme);
      }
    },

    onEnterGalleryOverlay(el) {
      gsap.fromTo(
        el,
        { autoAlpha: 0 },
        { autoAlpha: 1 },
      );
    },

    onLeaveGalleryOverlay(el, done) {
      gsap.fromTo(
        el,
        { autoAlpha: 1 },
        { autoAlpha: 0, onComplete: done },
      );
    },

    ...mapActions('app', ['setTheme']),
    ...mapActions('home', ['setGalleryOpen']),
  },
}
</script>

<style lang="scss" scoped>
@import './Gallery';
</style>