<template>
  <div class="tunnelSquares">
    tunnel squares
  </div>
</template>

<script>
export default {
  name: 'TunnelSquaresComponent',

  methods: {
    animate(dir) {
      console.log(dir);
    },
  },
}
</script>

<style lang="scss" scoped>
@import './TunnelSquares';
</style>