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
import { gsap } from 'gsap';
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
    ...mapState('app', ['hasPreloader', 'menuOpen']),
    ...mapState('home', ['audio']),
  },

  watch: {
    hasPreloader: 'toggleAudio',
    $route: 'animateAudio',
    menuOpen: 'animateAudio'
  },

  mounted () {
    this.audioPlayer = new Audio('/audio/audio.mpeg');
    this.audioPlayer.loop = true;
    this.audioFiltered = new Audio('/audio/audio_filtered_1.mp3');
    this.audioFiltered.loop = true;
    this.audioFiltered.volume = 0;

    if(!this.hasPreloader) {
      this.audioPlayer.play()
      this.audioFiltered.play()
    }
  },

  beforeDestroy() {
    this.audioPlayer.removeAttribute('src');
    this.audioPlayer.load()
    this.audioFiltered.removeAttribute('src');
    this.audioFiltered.load()
  },

  methods: {
    toggleAudio () {
      if(this.audioPlayer.paused){
        this.audioPlayer.play();
        this.audioFiltered.play();
        this.setAudio(true)
      } else {
        this.audioPlayer.pause();
        this.audioFiltered.pause();
        this.setAudio(false)
      }
    },

    animateAudio () {
      if (this.$route.name !== 'index' || this.menuOpen) {
        gsap.to(this.$el, {
          y: 50,
          duration: 0.6,
          ease: 'expo.out'
        })
        gsap.to(this.audioPlayer, {
          volume: 0
        })
        gsap.to(this.audioFiltered, {
          volume: 1
        })
      } else {
        gsap.to(this.$el, {
          y: 0,
          duration: 0.6,
          ease: 'expo.out'
        })
        gsap.to(this.audioPlayer, {
          volume: 1
        })
        gsap.to(this.audioFiltered, {
          volume: 0
        })
      }
    },

    ...mapActions('home', ['setAudio'])
  }
};
</script>

<style lang="scss" scoped>
@import './AudioPlayer';
</style>
