<template>
  <component :is="href ? 'NuxtLink' : 'button'" :to="href" class="button">
    <svg width="147" height="61" viewBox="0 0 147 61" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.144531 3C0.144531 1.34315 1.48768 0 3.14453 0H143.357C145.014 0 146.357 1.34315 146.357 3V50L141.501 55.5L136.645 61H3.14453C1.48768 61 0.144531 59.6569 0.144531 58V3Z"
        fill="white"
      />
      <path
        d="M0.644531 3C0.644531 1.61929 1.76382 0.5 3.14453 0.5H143.357C144.738 0.5 145.857 1.61929 145.857 3V49.8108L141.126 55.1691L136.419 60.5H3.14453C1.76382 60.5 0.644531 59.3807 0.644531 58V3Z"
        stroke="black"
        stroke-opacity="0.1"
      />
    </svg>
    <div>
      <Icon v-if="icon" :type="icon" class="icon" />
      <span v-if="name">{{ name }}</span>
    </div>
  </component>
</template>

<script>
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'SocialButton',

  components: {
    Icon,
  },

  props: {
    href: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import './SocialButton.scss';
</style>

