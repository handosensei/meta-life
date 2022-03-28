<template>
  <div class="backToExperience" :class="{ 'isLight': theme === 'light' }">
    <NuxtLink to="/" class="link">Back to the Experience</NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'BackToExperienceComponent',

  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark',
    }
  }
}
</script>

<style lang="scss" scoped>
@import './BackToExperience';
</style>