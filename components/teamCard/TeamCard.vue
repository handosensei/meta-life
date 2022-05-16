<template>
  <div class="Card">
    <div v-if="image" class="imageWrapper">
      <img
        class="image"
        :src="image.src"
        :alt="`${title} logo`"
      />
    </div>

    <div class="content">
      <div class="title">{{ title }}</div>
      <p class="text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import imageDimensions from '~/utils/functions/imageDimensions';

export default {
  name: 'TeamCardComponent',

  props: {
    image: {
      type: Object,
      default: null,
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

  computed: {
    imageSize() {
      const imageSize = 80000;
      const dimensions = imageDimensions(this.image, imageSize);

      return dimensions;
    },

    ...mapState('app', ['windowSize']),
  },
};
</script>

<style lang="scss" scoped>
@import './TeamCard';
</style>
