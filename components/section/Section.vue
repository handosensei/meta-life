<template>
  <section
    class="section"
    :class="{ 'isLight': theme === 'light' }"
  >
    <h1 class="title">{{ name }}</h1>
  </section>
</template>

<script>
import { mapState } from 'vuex';

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
  },

  computed: {
    ...mapState('app', ['theme']),
  },
}
</script>

<style lang="scss" scoped>
@import './Section';
</style>