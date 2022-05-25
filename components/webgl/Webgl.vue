<template>
  <div class="webgl" />
</template>

<script>
import Canvas from '~/imog/Canvas';

export default {
  name: 'WebglComponent',
  mounted() {
    if (window.canvas) {
      console.warn('Using Cached canvas in dev mode. Refresh browser for new version');
      this.canvas = window.canvas;
      return;
    }
    window.canvas = this.canvas = new Canvas({
      options: {
        handleItemLoaded: ({ itemsLoaded, itemsTotal }) => {
          console.log('Loading progress', Math.round(itemsLoaded / itemsTotal));
        },
        handleReady: () => {
          console.log('Loading complete');
          this.canvas.props.target = 0;
        },
        domElement: this.$el,
      },
    });
  },
};
</script>

<style lang="scss" scoped>
@import './Webgl';
</style>
