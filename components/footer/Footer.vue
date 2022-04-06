<template>
  <footer class="footer">
    <Socials />
    <AudioPlayer />
  </footer>
</template>

<script>
import AudioPlayer from '~/components/audioPlayer/AudioPlayer.vue';
import Socials from '~/components/socials/Socials.vue';

export default {
  name: 'FooterComponent',

  components: {
    AudioPlayer,
    Socials,
  },
}
</script>

<style lang="scss" scoped>
@import './Footer';
</style>