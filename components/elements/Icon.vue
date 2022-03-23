<template>
  <component :is="type" />
</template>

<script>
import Burger from '~/assets/svg/burger.svg?inline=true';
import Discord from '~/assets/svg/discord.svg?inline=true';
import Equalizer from '~/assets/svg/equalizer.svg?inline=true';
import Logo from '~/assets/svg/logo.svg?inline=true';
import MetaLegends from '~/assets/svg/metaLegends.svg?inline=true';
import Play from '~/assets/svg/play.svg?inline=true';
import PreloaderLogo from '~/assets/svg/preloaderLogo.svg?inline=true';
import PreloaderProgress from '~/assets/svg/preloaderProgress.svg?inline=true';
import PreloaderShape from '~/assets/svg/preloaderShape.svg?inline=true';
import Twitter from '~/assets/svg/twitter.svg?inline=true';
import Wordmark from '~/assets/svg/wordmark.svg?inline=true';

export default {
  name: 'IconComponent',

  components: {
    Burger,
    Discord,
    Equalizer,
    Logo,
    MetaLegends,
    Play,
    PreloaderLogo,
    PreloaderProgress,
    PreloaderShape,
    Twitter,
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
