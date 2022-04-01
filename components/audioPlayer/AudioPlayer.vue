<template>
	<div class="audioPlayer">
		<Icon type="Equalizer" />
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
