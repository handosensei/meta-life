<template>
  <div class="videoPlayer">
    <video ref="video" class="video" :poster="video.poster" autoplay playsInline @click="onPlayPause" @canplay="onCanPlay" @ended="onEnded">
      <source :src="video.src" type="video/mp4" />
    </video>

    <div ref="controls" class="controls">
      <div class="title">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </div>

      <div class="timeline">
        <input ref="range" class="range" type="range" min="0" step="0.5" @input="changeTime" />
        <progress ref="progress" class="progress" max="100" />
      </div>

      <div class="controlsButtons">
        <button type="button" class="buttonPlay" @click="onPlayPause">
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        <div ref="time" class="time" />
        <button type="button" class="buttonMute" @click="onMute">
          <Icon ref="equalizer" type="EqualizerVideo" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import sniffer from '@antinomy-studio/sniffer';
import { gsap } from 'gsap';
import { mapActions } from 'vuex';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'VideoPlayerComponent',

  components: {
    Icon,
  },

  props: {
    video: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isPlaying: true,

      timer: 0,
      idleTime: 3000,
    };
  },

  mounted() {
    this.isMounted = true;
    this.idleStart();
    this.setEqualizer();

    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('keydown', this.onKeyDown);
    this.$nuxt.$on('window:raf', this.onRaf);
  },

  beforeDestroy() {
    this.idleStop();

    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener('keydown', this.onKeyDown);
    this.$nuxt.$off('window:raf', this.onRaf);
  },

  methods: {
    setEqualizer() {
      this.bars = this.$refs.equalizer.$el.childNodes;
      gsap.set(this.bars, { transformOrigin: 'bottom center', scaleY: 0.1 });

      this.animateEqualizer();
    },

    onEnter() {
      gsap.fromTo(
        this.$refs.button,
        {
          scale: 0.1,
        },
        {
          scale: 1,
          delay: 2,
          duration: 2,
          ease: 'expo.inOut',
        }
      );
    },

    animateEqualizer() {
      if (this.$refs.video.muted) {
        gsap.killTweensOf(this.bars);

        gsap.to(this.bars, {
          duration: 0.8,
          ease: 'expo.out',
          scaleY: 0.1,
        });
      } else {
        gsap.fromTo(
          this.bars[0],
          {
            scaleY: 0.1,
          },
          {
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            scaleY: 1,
          }
        );

        gsap.fromTo(
          this.bars[1],
          {
            scaleY: 0.1,
          },
          {
            delay: 0.1,
            repeat: -1,
            yoyo: true,
            scaleY: 1,
            duration: 0.3,
          }
        );

        gsap.fromTo(
          this.bars[2],
          {
            scaleY: 0.3,
          },
          {
            delay: 0.2,
            repeat: -1,
            yoyo: true,
            scaleY: 1,
            duration: 0.6,
          }
        );

        gsap.fromTo(
          this.bars[3],
          {
            scaleY: 0.1,
          },
          {
            repeat: -1,
            yoyo: true,
            scaleY: 1,
            duration: 0.4,
          }
        );
      }
    },

    onKeyDown({ key, keyCode }) {
      if (key === 'Escape') {
        this.setVideoPlayerOpen(false);
      }

      // Spacebar
      if (keyCode === 32) {
        this.onPlayPause();
      }
    },

    onMute() {
      if (this.$refs.video.muted) {
        this.$refs.video.muted = false;
      } else {
        this.$refs.video.muted = true;
      }

      this.animateEqualizer();
    },

    onPlayPause() {
      if (this.isPlaying) {
        this.$refs.video.pause();
      } else {
        this.$refs.video.play();
      }

      this.isPlaying = !this.isPlaying;
    },

    onRaf() {
      this.setTime();

      this.$refs.time.innerHTML = this.formatTime(this.videoCurrentTime);
    },

    onCanPlay() {
      const { video, range, progress } = this.$refs;
      if (video?.duration) {
        range.max = Math.round(video.duration * 10);
        progress.max = Math.round(video.duration * 10);
      }
    },

    onEnded() {
      this.setVideoPlayerOpen(false);
    },

    idleStart() {
      if (sniffer.isTouch || sniffer.isIos || sniffer.isIPadOS || sniffer.isIpad) {
        return;
      }

      this.idle = true;
      this.onIdle();
    },

    idleStop() {
      if (sniffer.isTouch || sniffer.isIos || sniffer.isIPadOS || sniffer.isIpad) {
        return;
      }

      this.idle = false;
      clearTimeout(this.timer);
    },

    onIdle() {
      if (sniffer.isTouch || sniffer.isIos || sniffer.isIPadOS || sniffer.isIpad) {
        return;
      }

      clearTimeout(this.timer);

      this.onShowControls();

      this.timer = setTimeout(() => {
        this.onHideControls();
      }, this.idleTime);
    },

    onMouseMove(e) {
      if (sniffer.isTouch || sniffer.isIos || sniffer.isIPadOS || sniffer.isIpad) {
        return;
      }

      if (this.idle) {
        this.onIdle();
      }
    },

    onShowControls() {
      gsap.to(this.$refs.controls, { duration: 0.5, autoAlpha: 1 });
    },

    onHideControls() {
      gsap.to(this.$refs.controls, { duration: 0.5, autoAlpha: 0 });
    },

    formatTime(seconds) {
      let minutes = Math.floor(seconds / 60);
      minutes = minutes >= 10 ? minutes : '0' + minutes;
      seconds = Math.floor(seconds % 60);
      seconds = seconds >= 10 ? seconds : '0' + seconds;
      return minutes + ':' + seconds;
    },

    setTime() {
      const { video, range, progress } = this.$refs;
      this.videoCurrentTime = video.currentTime;
      range.value = video.currentTime * 10;
      progress.value = video.currentTime * 10;
    },

    changeTime() {
      this.$refs.video.currentTime = this.$refs.range.value / 10;
      this.setTime();
    },

    ...mapActions('app', ['setVideoPlayerOpen']),
  },
};
</script>

<style lang="scss" scoped>
@import './VideoPlayer';
</style>
