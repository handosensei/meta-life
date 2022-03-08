<template>
  <div :class="['page',`${uid? `page--${uid}`:''}`]">
    <slot v-if="hasBlocks" />
    <div v-else ref="bounding" class="bounding">
      <slot />
    </div>
  </div>
</template>

<script>
import Page from '~/mixins/page'
import Scroll from '~/mixins/scroll'

export default {
  mixins: [ Page, Scroll ],
  props: {
    uid: {
      type: String,
      default: ''
    },
    hasBlocks: {
      type: Boolean,
      default: false
    }
  }
}
</script>
