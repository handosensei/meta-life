<template>
  <div class="partnersHero">
    <h1 class="title" v-html="title" />
  </div>
</template>

<script>
export default {
  name: 'PartnersHeroComponent',

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import './PartnersHero';
</style>
