<template>
  <div class="credits">
    <div class="sub">Powered by</div>

    <Icon class="logo" type="MetaLegends" />

    <div class="sub">
      <span>visit : <a class="subLink" href="https://meta-legends.com" target="_blank" rel="noreferrer">meta-legends.com</a></span>
      <span class="mobile-none" style="margin-left: 15px; opacity: 0.4"><a href="https://meta-life-1.gitbook.io/legal/privacy-policy" class="subLink">Privacy Policy</a></span>
      <span class="mobile-none" style="margin-left: 5px; opacity: 0.4"><a href="https://meta-life-1.gitbook.io/legal/" class="subLink">Terms &amp; Conditions</a></span>
    </div>
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
