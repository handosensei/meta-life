<template>
  <h2 class="heading">{{ text }}</h2>
</template>

<script>
export default {
  name: 'HeadingComponent',

  props: {
    text: {
      type: String,
      required: true,
    },
  }
}
</script>

<style lang="scss" scoped>
@import './Heading';
</style>