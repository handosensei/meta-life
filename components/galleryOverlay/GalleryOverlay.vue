<template>
  <FocusLock :disabled="!galleryOpen || menuOpen">
    <div class="galleryOverlay">
      <div class="content">
        <div class="head">
          <div class="title">{{ activeItem.title }}</div>
          <div class="subtitle">{{ activeItem.name }}</div>
        </div>
        <p class="text">{{ activeItem.text }}</p>
      </div>

      <img
        class="backgroundImage"
        :src="activeItem.image.highres.src"
        :alt="activeItem.image.highres.alt"
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
            v-for="item in items"
            :key="item.id"
            class="navButton"
            :class="{ 'isActive': activeItem === item }"
            type="button"
            @click="setActiveItem(item)"
          >
            <img
              class="navImage"
              :src="item.image.thumb.src"
              :alt="item.image.thumb.alt"
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

  computed: {
    ...mapState('app', ['menuOpen']),
    ...mapState('home', ['galleryOpen', 'activeSection']),
  },

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    onKeyDown({ key }) {
      if (key === 'Escape' && !this.menuOpen) {
        this.toggleOverlay('');
        this.setTheme(this.activeSection.theme);
      }

      const currentIndex = this.items.indexOf(this.activeItem, 0);

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % this.items.length;
        const nextItem = this.items[nextIndex];
        this.setActiveItem(nextItem);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        let prevIndex;
        if (currentIndex === 0) {
          prevIndex = this.items.length - 1;
        } else {
          prevIndex = currentIndex - 1;
        }
        
        const prevItem = this.items[prevIndex];
        this.setActiveItem(prevItem);
      }
    },

    ...mapActions('app', ['setTheme']),
  },
}
</script>

<style lang="scss" scoped>
@import './GalleryOverlay';
</style>