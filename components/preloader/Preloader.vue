<template>
  <div class="preloader">
    <h1 class="title">
      Meta<br />Life
    </h1>

    <div ref="progress" class="progress">
      0%
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions } from 'vuex';

export default {
  name: 'PreloaderComponent',

  created() {
    const { skipIntro } = this.$router.history.current.query;

    if (skipIntro) {
      this.setAssetsPreloaded();
    }
  },

  mounted() {
    const progress = {
      value: 0,
      end: 100,
    }

    gsap.to(
      progress,
      {
        duration: 2,
        value: progress.end,
        onUpdate: () => this.updateProgress(progress.value),
        onComplete: this.setAssetsPreloaded
      },
    );
  },

  methods: {
    updateProgress(value) {
      this.$refs.progress.innerHTML = `${value.toFixed()}%`;
    },

    ...mapActions('app', ['setAssetsPreloaded']),
  },
}
</script>

<style lang="scss" scoped>
@import './Preloader';
</style>