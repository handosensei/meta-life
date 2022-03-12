<template>
  <section
    class="section"
    :class="{ 'isLight': theme === 'light' }"
  >
    <!-- TODO: Remove this -->
    <h1 class="head">{{ name }}</h1>

    <SectionText
      v-if="text"
      :has-play-trailer-button="hasPlayTrailerButton"
      :number="chapterNumber"
      :text="text"
    />

    <SectionTitle
      v-if="title"
      :title="title"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex';

import { getChapterIndex } from '~/utils/functions/chapterHelpers';

import SectionText from '~/components/text/Text.vue';
import SectionTitle from '~/components/title/Title.vue';

export default {
  name: 'SectionComponent',

  components: {
    SectionText,
    SectionTitle,
  },

  props: {
    hasPlayTrailerButton: {
      type: Boolean,
      required: false,
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

    text: {
      type: String,
      required: false,
      default: '',
    },

    title: {
      type: String,
      required: false,
      default: '',
    },
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