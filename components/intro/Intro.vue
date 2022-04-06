<template>
  <div class="sectionIntro">
    <div class="content">
      <h3 v-if="subtitle" class="subtitle">{{ subtitle }}</h3>
      <h2 class="title" v-html="title" />
      <p class="text" v-html="text" />
    </div>

    <div v-if="galleryItems">
      <button
        v-for="galleryItem in galleryItems"
        :key="galleryItem.id"
        class="galleryItem"
        type="button"
        :aria-label="`open ${galleryItem.category} gallery album`"
        @click="onToggleOverlay(galleryItem)"
      >
        <img class="galleryImage" :src="galleryItem.slides[0].image.thumb.src" :alt="galleryItem.slides[0].image.thumb.alt">
        <Icon class="galleryPlus" type="Plus" />
      </button>
    </div>
  </div>
</template>

<script>
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

  methods: {
    onToggleOverlay(item) {
      this.$root.$emit('galleryOverlay:toggle', item);
    },
  },
}
</script>

<style lang="scss" scoped>
@import './Intro';
</style>