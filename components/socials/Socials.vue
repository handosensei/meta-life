<template>
	<div class="socials">
		<a href="#" class="discordIcon" target="_blank" rel="noreferrer" aria-label="Discord">
			<Icon type="Discord" />
		</a>
		<a href="#" class="twitterIcon" target="_blank" rel="noreferrer" aria-label="Twitter">
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
}
</script>

<style lang="scss" scoped>
@import './Socials';
</style>
