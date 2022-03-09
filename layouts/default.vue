<template>
  <Nuxt />
</template>

<script>
import { mapActions } from 'vuex';

import throttle from '~/utils/functions/throttle';

export default {
  name: 'DefaultLayout',

  beforeMount() {
    window.addEventListener('resize', throttle(this.onResize, 66), false);
    requestAnimationFrame(this.onRaf);

    // this.loadFonts();
    this.setWindowSize();
  },

  methods: {
    // loadFonts() {
    //   const hasCustomFont = false
    //   if (document.fonts && hasCustomFont) {
    //     const Font = new FontFace('Font-Name', 'url(/fonts/Font-Name.woff2)', {
    //       style: 'normal',
    //       weight: '400'
    //     })
    //     Promise.all([Font.load()]).then(() => {
    //       document.fonts.add(Font)
    //       this.$root.$emit('fonts:loaded')
    //     })
    //   } else {
    //     this.$root.$emit('fonts:loaded')
    //   }
    // },

    onResize() {
      this.setWindowSize();
      this.$root.$emit('window:resize');
    },

    onRaf() {
      this.$root.$emit('window:raf');
      requestAnimationFrame(this.onRaf);
    },

    ...mapActions('app', ['setWindowSize']),
  },
};
</script>
