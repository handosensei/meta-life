<template>
	<div class="audioPlayer">
		<Icon class="equalizerIcon" type="Equalizer" />
	</div>
</template>

<script>
import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'AudioPlayerComponent',

  components: {
    Icon,
  },
}
</script>

<style lang="scss" scoped>
@import './AudioPlayer';
</style>
