<template>
  <component :is="type" />
</template>

<script>
import Burger from '~/assets/svg/burger.svg?inline=true';
import Logo from '~/assets/svg/logo.svg?inline=true';

export default {
  name: 'IconComponent',

  components: {
    Burger,
    Logo,
  },

  props: {
    type: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Icon';
</style>
