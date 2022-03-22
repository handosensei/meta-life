<template>
  <div>
    <!-- <div>{{ number }}</div> -->
    <h2 class="title" v-html="title" />
    <p v-if="text" class="text">{{ text }}</p>
    <BaseButton v-if="hasPlayTrailerButton" as="button" text="Play the trailer" />
  </div>
</template>

<script>
import BaseButton from '~/components/elements/BaseButton.vue';

export default {
  name: 'TextComponent',

  components: {
    BaseButton,
  },

  props: {
    hasPlayTrailerButton: {
      type: Boolean,
      required: false,
    },

    // number: {
    //   type: Number,
    //   required: true,
    // },

    text: {
      type: String,
      required: false,
      default: '',
    },

    title: {
      type: String,
      required: true,
    },
  }
}
</script>

<style lang="scss" scoped>
@import './Text';
</style>