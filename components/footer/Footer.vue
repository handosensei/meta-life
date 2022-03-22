<template>
  <footer class="footer">
    <TrailerPreview class="trailerPreview" />

    <div>
      socials
    </div>
  </footer>
</template>

<script>
import TrailerPreview from '~/components/trailerPreview/TrailerPreview.vue';

export default {
  name: 'FooterComponent',

  components: {
    TrailerPreview,
  },
}
</script>

<style lang="scss" scoped>
@import './Footer';
</style>