<template>
  <div class="teamHero">
    <video src="/Legends.mp4" autoplay loop muted playsinline></video>
    <h1 class="title" v-html="title" />
  </div>
</template>

<script>
export default {
  name: 'TeamHeroComponent',

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import './TeamHero';
</style>
