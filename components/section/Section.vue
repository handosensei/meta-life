<template>
  <section
    class="section"
    :class="{ 'isLight': theme === 'light' }"
  >
    <component :is="component.name" v-bind="component" />
  </section>
</template>

<script>
import { mapState } from 'vuex';

import SectionGallery from '~/components/gallery/Gallery.vue';
import SectionHeading from '~/components/heading/Heading.vue';
import SectionText from '~/components/text/Text.vue';

export default {
  name: 'SectionComponent',

  components: {
    SectionGallery,
    SectionHeading,
    SectionText,
  },

  props: {
    component: {
      type: Object,
      required: true,
    },

    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState('app', ['theme']),
    ...mapState('home', ['chapters', 'activeChapter']),
  },
}
</script>

<style lang="scss" scoped>
@import './Section';
</style>