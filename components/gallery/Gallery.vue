<template>
  <div class="gallery">
    <h2 class="title">{{ title }}</h2>

    <div class="items">
      <button
        v-for="item in items"
        :key="item.id"
        class="item"
        type="button"
        @click="onToggleOverlay(item)"
      >
        <!-- <NuxtPicture class="image" :src="item.slides[0].image.thumb.src" :alt="item.slides[0].image.thumb.alt" /> -->
        <img class="image" :src="item.slides[0].image.thumb.src" :alt="item.slides[0].image.thumb.alt">
        <h3 class="category">
          {{ item.category }}
        </h3>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'GalleryComponent',

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

    onToggleOverlay(item) {
      this.$root.$emit('galleryOverlay:toggle', item);
    },

    ...mapActions('app', ['setTheme']),
    ...mapActions('home', ['setGalleryOpen']),
  },
}
</script>

<style lang="scss" scoped>
@import './Gallery';
</style>