<template>
	<button type="button" class="audioPlayer" aria-label="Toggle sound button">
		<Icon type="Equalizer" />
	</button>
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
