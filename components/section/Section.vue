<template>
  <section>
    <h1 class="title">{{ name }}</h1>
  </section>
</template>

<script>
export default {
  name: 'SectionComponent',

  props: {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
  }
}
</script>

<style lang="scss" scoped>
@import './Section';
</style>