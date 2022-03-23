<template>
	<div class="social">
		<Icon class="discordIcon" type="Discord" />
		<Icon class="twitterIcon" type="Twitter" />
		<span>Join the</span> community
	</div>
</template>

<script>
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'FooterComponent',

  components: {
    Icon
  },
}
</script>

<style lang="scss" scoped>
@import './Social';
</style>
