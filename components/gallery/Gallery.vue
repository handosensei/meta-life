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
        <img class="image" :src="item.slides[0].image.thumb.src" :alt="item.slides[0].image.thumb.alt">
        <h3 class="category">
          {{ item.category }}
        </h3>
      </button>
    </div>

    <GalleryOverlay
      v-if="galleryOpen"
      :active-item="activeItem"
      :items="items"
      :set-active-item="setActiveItem"
      :toggle-overlay="toggleOverlay"
    />
  </div>
</template>

<script>
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

  methods: {
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

    ...mapActions('app', ['setTheme']),
    ...mapActions('home', ['setGalleryOpen']),
  },
}
</script>

<style lang="scss" scoped>
@import './Gallery';
</style>