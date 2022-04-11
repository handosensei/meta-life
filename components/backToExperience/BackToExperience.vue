<template>
  <div class="backToExperience" :class="{ 'isLight': theme === 'light' }">
    <NuxtLink to="/" class="link">Back to the Experience</NuxtLink>
    <Icon type="LogoOutline" class="logoOutline" />
  </div>
</template>

<script>
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'BackToExperienceComponent',

  components: {
    Icon,
  },

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