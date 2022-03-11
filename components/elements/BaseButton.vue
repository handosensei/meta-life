<template>
  <component
    :is="as"
    class="baseButton"
    :href="isLink ? href : null"
    :to="as === 'NuxtLink' ? href : null"
    :target="as === 'a' && target === '_blank' ? target : null"
    :type="as === 'button' ? type : null"
    @click="onClick"
  >
    {{ text }}
  </component>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BaseButtonComponent',

  props: {
    as: {
      type: String,
      required: false,
      default: 'NuxtLink',
    },

    href: {
      type: String,
      required: false,
      default: '',
    },

    onClick: {
      type: Function,
      required: false,
      default: () => {},
    },

    target: {
      type: String,
      required: false,
      default: '_self',
    },

    text: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: false,
      default: 'button',
    },
  },

  computed: {
    isLink() {
      return this.as === 'NuxtLink' || this.as === 'a';
    },
  },
});
</script>

<style lang="scss" scoped>
@import './BaseButton';
</style>
