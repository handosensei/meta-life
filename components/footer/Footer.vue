<template>
  <footer class="footer">
    <TrailerPreview />
    <Social />
    <AudioPlayer />
  </footer>
</template>

<script>
import AudioPlayer from '~/components/audioPlayer/AudioPlayer.vue';
import Social from '~/components/social/Social.vue';
import TrailerPreview from '~/components/trailerPreview/TrailerPreview.vue';

export default {
  name: 'FooterComponent',

  components: {
    AudioPlayer,
    Social,
    TrailerPreview,
  },
}
</script>

<style lang="scss" scoped>
@import './Footer';
</style>