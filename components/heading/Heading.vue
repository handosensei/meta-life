<template>
  <div>
    <h2
      class="heading"
      :class="{ 'isLarge': size === 'large' }"
    >
      {{ title }}
    </h2>

    <NuxtLink v-if="link" :to="link.href">{{ link.text }}</NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'HeadingComponent',

  props: {
    size: {
      type: String,
      required: false,
      default: 'small',
      validator: (value) => ['small', 'large'].includes(value),
    },

    title: {
      type: String,
      required: true,
    },

    link: {
      type: Object,
      required: false,
      default: () => {}
    },
  }
}
</script>

<style lang="scss" scoped>
@import './Heading';
</style>