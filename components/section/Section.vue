<template>
  <section
    class="section"
    :class="{ 'isLight': theme === 'light' }"
  >
    <!-- TODO: Remove this -->
    <h1 class="head">{{ name }}</h1>

    <!-- <SectionText
      v-if="text"
      :has-play-trailer-button="hasPlayTrailerButton"
      :number="chapterNumber"
      :text="text"
    /> -->

    <component :is="component.name" v-bind="component" />

    <!-- <SectionHeading
      v-if="heading"
      :text="heading"
    /> -->
  </section>
</template>

<script>
import { mapState } from 'vuex';

import { getChapterIndex } from '~/utils/functions/chapterHelpers';

import SectionHeading from '~/components/heading/Heading.vue';
import SectionText from '~/components/text/Text.vue';

export default {
  name: 'SectionComponent',

  components: {
    SectionHeading,
    SectionText,
  },

  props: {
    // hasPlayTrailerButton: {
    //   type: Boolean,
    //   required: false,
    // },

    component: {
      type: Object,
      required: true,
    },

    id: {
      type: String,
      required: true,
    },

    // TODO: Remove this prop
    name: {
      type: String,
      required: true,
    },

    // text: {
    //   type: String,
    //   required: false,
    //   default: '',
    // },

    // heading: {
    //   type: String,
    //   required: false,
    //   default: '',
    // },
  },

  computed: {
    chapterNumber() {
      return getChapterIndex(this.chapters, this.activeChapter) + 1;
    },

    ...mapState('app', ['theme']),
    ...mapState('home', ['chapters', 'activeChapter']),
  },
}
</script>

<style lang="scss" scoped>
@import './Section';
</style>