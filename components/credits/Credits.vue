<template>
  <div class="credits">
    <div class="sub">Powered by</div>

    <Icon class="logo" type="MetaLegends" />

    <div class="sub">visit : <a class="subLink" href="https://meta-legends.com" target="_blank" rel="noreferrer">meta-legends.com</a></div>
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
