<template>
  <component :is="type" />
</template>

<script>
import Close from '~/assets/svg/close.svg?inline=true';
import CloseButton from '~/assets/svg/closeButton.svg?inline=true';
import Discord from '~/assets/svg/discord.svg?inline=true';
import Discover from '~/assets/svg/discover.svg?inline=true';
import Equalizer from '~/assets/svg/equalizer.svg?inline=true';
import EqualizerVideo from '~/assets/svg/equalizerVideo.svg?inline=true';
import Instagram from '~/assets/svg/instagram.svg?inline=true';
import LogoButton from '~/assets/svg/logoButton.svg?inline=true';
import LogoOutline from '~/assets/svg/logoOutline.svg?inline=true';
import MenuButton from '~/assets/svg/menuButton.svg?inline=true';
import MetaLegends from '~/assets/svg/metaLegends.svg?inline=true';
import NavButton from '~/assets/svg/navButton.svg?inline=true';
import Play from '~/assets/svg/play.svg?inline=true';
import Plus from '~/assets/svg/plus.svg?inline=true';
import PreloaderLogo from '~/assets/svg/preloaderLogo.svg?inline=true';
import PreloaderProgress from '~/assets/svg/preloaderProgress.svg?inline=true';
import Sphere from '~/assets/svg/sphere.svg?inline=true';
import Tunnel from '~/assets/svg/tunnel.svg?inline=true';
import Twitter from '~/assets/svg/twitter.svg?inline=true';
import Wordmark from '~/assets/svg/wordmark.svg?inline=true';

export default {
  name: 'IconComponent',

  components: {
    Close,
    CloseButton,
    Discord,
    Discover,
    Equalizer,
    EqualizerVideo,
    LogoButton,
    LogoOutline,
    MenuButton,
    MetaLegends,
    NavButton,
    Play,
    Plus,
    PreloaderLogo,
    PreloaderProgress,
    Sphere,
    Tunnel,
    Twitter,
    Instagram,
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
