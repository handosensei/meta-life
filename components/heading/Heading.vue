<template>
  <h2 class="heading">{{ title }}</h2>
</template>

<script>
export default {
  name: 'HeadingComponent',

  props: {
    title: {
      type: String,
      required: true,
    },
  }
}
</script>

<style lang="scss" scoped>
@import './Heading';
</style>