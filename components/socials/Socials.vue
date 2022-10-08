<template>
  <div class="socials">
    <a href="https://discord.gg/meta-life" class="discordIcon" target="_blank" rel="noreferrer" aria-label="Discord">
      <Icon type="Discord" />
    </a>
    <a href="https://twitter.com/metalegendsnft" class="twitterIcon" target="_blank" rel="noreferrer" aria-label="Twitter">
      <Icon type="Twitter" />
    </a>
    <span>Join the</span> community
  </div>
</template>

<script>
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'SocialsComponent',

  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped>
@import './Socials';
</style>
