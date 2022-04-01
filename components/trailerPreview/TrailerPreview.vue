<template>
  <div>
    <button
      class="trailerPreview"
      type="button"
      aria-label="Play trailer"
      @click="setVideoPlayerOpen(true)"
    >
      <div class="trailerTitle">
        <span>Play</span> the trailer
      </div>

      <div class="trailerButton">
        <img class="trailerImage" src="/img/trailerImage.png" alt="placeholder image">
        <Icon class="playIcon" type="Play" />
      </div>
    </button>

    <VideoPlayer
      v-if="videoPlayerOpen"
      :video="{
        src: 'https://cdn.videvo.net/videvo_files/video/free/2016-03/large_watermarked/Hologram_Planet_by_nuva_preview.mp4',
        poster: '/img/trailerImage.png'
      }"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Icon from '~/components/elements/Icon.vue';
import VideoPlayer from '~/components/videoPlayer/VideoPlayer.vue';

export default {
  name: 'TrailerPreviewComponent',

  components: {
    Icon,
    VideoPlayer,
  },

  computed: {
    ...mapState('app', ['videoPlayerOpen']),
  },

  created() {
    this.$root.$on('trailerPreview:toggleVideoPlayer', this.toggleVideoPlayer);
  },

  beforeDestroy() {
    this.$root.$off('trailerPreview:toggleVideoPlayer', this.toggleVideoPlayer);
  },

  methods: {
    toggleVideoPlayer() {
      this.setVideoPlayerOpen(!this.videoPlayerOpen);
    },

    ...mapActions('app', ['setVideoPlayerOpen']),
  }
}
</script>

<style lang="scss" scoped>
@import './TrailerPreview';
</style>