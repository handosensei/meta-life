<template>
  <footer class="footer">
    <TrailerPreview />
    <Socials />
    <AudioPlayer />
  </footer>
</template>

<script>
import AudioPlayer from '~/components/audioPlayer/AudioPlayer.vue';
import Socials from '~/components/socials/Socials.vue';
import TrailerPreview from '~/components/trailerPreview/TrailerPreview.vue';

export default {
  name: 'FooterComponent',

  components: {
    AudioPlayer,
    Socials,
    TrailerPreview,
  },
}
</script>

<style lang="scss" scoped>
@import './Footer';
</style>