<template>
  <button type="button" class="audioPlayer" aria-label="Toggle sound button" @click="toggleAudio">
    <div class="text">
      <span class="sound">Sound :</span>
      <span class="onOff">{{ playing ? 'On' : 'Off' }}</span>
    </div>
    <Icon ref="icon" type="Equalizer" />
  </button>
</template>

<script>
import { mapState } from 'vuex';
import { gsap } from 'gsap';
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'AudioPlayerComponent',

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
  },

  watch: {
    hasPreloader: 'toggleAudio'
  },

  mounted () {
    this.audioPlayer = new Audio('/audio/bensound-newdawn.mp3');
    this.audioPlayer.loop = true;
  },

  components: {
    Icon,
  },

  methods: {
    toggleAudio () {
      if(this.audioPlayer.paused){
        this.audioPlayer.play();
        this.playing = true;
      } else {
        this.audioPlayer.pause();
        this.playing = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './AudioPlayer';
</style>
