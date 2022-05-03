<template>
  <h2 class="title">{{ title }}</h2>
</template>

<script>
export default {
  name: 'TitleComponent',

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Title';
</style>
