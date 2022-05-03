<template>
  <div class="tunnelSquares" :class="{ isLight: theme === 'light' }">
    <Icon ref="squaresOne" class="squares" type="Tunnel" />
    <Icon ref="squaresTwo" class="squares" type="Tunnel" />
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapState } from 'vuex';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'TunnelSquaresComponent',

  components: {
    Icon,
  },

  computed: {
    ...mapState('app', ['theme']),
  },

  methods: {
    animate(dir) {
      const squaresOne = this.$refs.squaresOne.$el.children;
      const squaresTwo = this.$refs.squaresTwo.$el.children;

      gsap.fromTo(
        squaresOne,
        {
          scale: dir === 1 ? 0 : 3,
          transformOrigin: 'center',
        },
        {
          scale: 1,
          stagger: dir === 1 ? 0.1 : -0.1,
          rotate: dir === 1 ? '+=90' : '-=90',
          ease: 'expo.inOut',
          duration: 2,
        }
      );

      gsap.fromTo(
        squaresTwo,
        {
          scale: 1,
          visibility: 'visible',
          transformOrigin: 'center',
        },
        {
          scale: dir === 1 ? 3 : 0,
          stagger: dir === 1 ? 0.1 : -0.1,
          rotate: dir === 1 ? '+=90' : '-=90',
          ease: 'expo.inOut',
          duration: 2,
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import './TunnelSquares';
</style>
