<template>
  <button
    class="iconButton"
    :class="{ 'isFilled': filled }"
    :type="type"
    @click="onClick"
  >
    <Icon :type="icon" />
  </button>
</template>

<script>
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'IconButtonComponent',

  components: {
    Icon,
  },

  props: {
    filled: {
      type: Boolean,
      required: false,
      default: false,
    },

    icon: {
      type: String,
      required: true,
    },

    onClick: {
      type: Function,
      required: true,
    },

    type: {
      type: String,
      required: false,
      default: 'button',
    },
  },
};
</script>

<style lang="scss" scoped>
@import './IconButton';
</style>
