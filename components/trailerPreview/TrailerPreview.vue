<template>
  <button class="trailerPreview" type="button" aria-label="Play trailer">
    <div class="trailerTitle">
      <span>Play</span> the trailer
    </div>

    <div class="trailerButton">
      <img class="trailerImage" src="/img/trailerImage.png" alt="placeholder image">
      <Icon class="playIcon" type="Play" />
    </div>
  </button>
</template>

<script>
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'TrailerPreviewComponent',

  components: {
    Icon,
  },
}
</script>

<style lang="scss" scoped>
@import './TrailerPreview';
</style>