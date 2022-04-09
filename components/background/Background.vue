<template>
  <div class="background" />
</template>

<script>
import { gsap } from 'gsap';
import { mapState } from 'vuex';

const COLORS = {
  dark: 'rgba(10, 14, 25, 1)',
  light: 'rgba(243, 243, 243, 1)',
};

export default {
  name: 'BackgroundComponent',

  data() {
    return {
      activeTheme: 'dark',
    };
  },

  computed: {
    ...mapState('app', ['theme']),
  },

  mounted() {
    this.$root.$on('background:switchColor', this.onSwitchColor);
  },

  beforeDestroy() {
    this.$root.$off('background:switchColor', this.onSwitchColor);
  },

  methods: {
    onSwitchColor(theme) {
      if (this.activeTheme === theme) {
        return;
      }

      const backgroundColor = COLORS[theme];
      gsap.to(this.$el, { duration: 0.5, backgroundColor });

      this.activeTheme = theme;
    }
  },
}
</script>

<style lang="scss" scoped>
@import './Background';
</style>