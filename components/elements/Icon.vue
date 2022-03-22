<template>
  <component :is="type" />
</template>

<script>
import Burger from '~/assets/svg/burger.svg?inline=true';
import Logo from '~/assets/svg/logo.svg?inline=true';
import MetaLegends from '~/assets/svg/metaLegends.svg?inline=true';
import PreloaderLogo from '~/assets/svg/preloaderLogo.svg?inline=true';
import PreloaderProgress from '~/assets/svg/preloaderProgress.svg?inline=true';
import PreloaderShape from '~/assets/svg/preloaderShape.svg?inline=true';
import Wordmark from '~/assets/svg/wordmark.svg?inline=true';

export default {
  name: 'IconComponent',

  components: {
    Burger,
    Logo,
    MetaLegends,
    PreloaderLogo,
    PreloaderProgress,
    PreloaderShape,
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
