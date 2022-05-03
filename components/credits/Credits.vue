<template>
  <div class="credits">
    <Icon class="logo" type="MetaLegends" />

    <div class="sub">visit : <a class="subLink" href="https://metalegends.com" target="_blank" rel="noreferrer">metalegends.com</a></div>
  </div>
</template>

<script>
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'CreditsComponent',

  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped>
@import './Credits';
</style>
