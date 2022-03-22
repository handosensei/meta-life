<template>
  <div class="container">
    <div>
      Play the trailer
    </div>

    <button type="button" aria-label="Play trailer">
      <img src="https://images.unsplash.com/photo-1591360236494-e6557e5ffa25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" alt="placeholder image">

      <div class="playButton">
        <Icon type="Play" />
      </div>
    </button>
  </div>
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