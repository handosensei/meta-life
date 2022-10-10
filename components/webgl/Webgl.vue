<template>
  <div class="webgl" />
</template>

<script>
import { gsap } from 'gsap';
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
          // console.log('Loading progress', Math.round(itemsLoaded / itemsTotal));
        },
        handleReady: () => {
          // console.log('Loading complete');
          gsap.to(this.$el, {
            autoAlpha: 1,
            duration: 0.4,
            ease: 'none',
            delay: 0.1,
          });
          // this.canvas.props.target = 0;
        },
        domElement: this.$el,
      },
      props: {
        isMobile: false,
      },
    });
  },
};
</script>

<style lang="scss" scoped>
@import './Webgl';
</style>
