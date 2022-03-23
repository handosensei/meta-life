<template>
  <div class="text" :class="positioningClass">
    <!-- <div>{{ number }}</div> -->
    <h2 class="title" v-html="title" />
    <p v-if="text" class="paragraph">{{ text }}</p>
    <BaseButton v-if="hasPlayTrailerButton" as="button" text="<span>Play</span> the trailer" />
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
  },

  computed: {
    positioningClass() {
      const CLASS = {
        'center top': 'positionCenterTop',
        'right top': 'positionRightTop',
        'left bottom': 'positionLeftBottom',
        'left center': 'positionLeftCenter',
        'right center': 'positionRightCenter',
      }

      return CLASS[this.position];
    }
  }
}
</script>

<style lang="scss" scoped>
@import './Text';
</style>