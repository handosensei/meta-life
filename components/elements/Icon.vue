<template>
  <component :is="type" />
</template>

<script>
import Burger from '~/assets/svg/burger.svg?inline=true';
import Logo from '~/assets/svg/logo.svg?inline=true';
import preloaderLogo from '~/assets/svg/preloaderLogo.svg?inline=true';
import preloaderProgress from '~/assets/svg/preloaderProgress.svg?inline=true';
import preloaderShape from '~/assets/svg/preloaderShape.svg?inline=true';
import Wordmark from '~/assets/svg/wordmark.svg?inline=true';

export default {
  name: 'IconComponent',

  components: {
    Burger,
    Logo,
    preloaderLogo,
    preloaderProgress,
    preloaderShape,
    Wordmark,
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
