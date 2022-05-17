<template>
  <button type="button" class="audioPlayer" aria-label="Toggle sound button" @click="toggleAudio">
    <div class="text">
      <span class="sound">Sound :</span>
      <span class="onOff">{{ audio ? 'On' : 'Off' }}</span>
    </div>
    <Icon ref="icon" type="Equalizer" />
  </button>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'AudioPlayerComponent',

    components: {
    Icon,
  },

  data: () => ({
    audioPlayer: {
      type: Object,
      default: () => {}
    },
    playing: {
      type: Boolean,
      default: false
    }
  }),

  computed: {
    ...mapState('app', ['hasPreloader']),
    ...mapState('home', ['audio']),
  },

  watch: {
    hasPreloader: 'toggleAudio'
  },

  mounted () {
    this.audioPlayer = new Audio('/audio/audio.mpeg');
    this.audioPlayer.loop = true;
    if(!this.hasPreloader) {
      this.audioPlayer.play()
    }
  },

  beforeDestroy() {
    this.audioPlayer.removeAttribute('src');
    this.audioPlayer.load()
  },

  methods: {
    toggleAudio () {
      if(this.audioPlayer.paused){
        this.audioPlayer.play();
        this.setAudio(true)
      } else {
        this.audioPlayer.pause();
        this.setAudio(false)
      }
    },

    ...mapActions('home', ['setAudio'])
  }
};
</script>

<style lang="scss" scoped>
@import './AudioPlayer';
</style>
