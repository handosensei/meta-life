<template>
  <nav class="chapterNav">
    <ul class="list">
      <li
        v-for="chapter in chapters"
        :key="chapter.id"
        class="listItem"
      >
        <button
          class="button"
          :class="{ 'isActive': chapter === activeChapter }"
          type="button"
          @click="onClick(chapter)"
        >
          {{ chapter.name }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ChapterNavComponent',

  computed: {
    ...mapState('home', ['chapters', 'activeChapter']),
  },

  methods: {
    onClick(chapter) {
      this.setActiveChapter(chapter);
      this.setActiveSection(chapter.sections[0]);
    },

    ...mapActions('home', ['setActiveChapter', 'setActiveSection']),
  },
}
</script>

<style lang="scss" scoped>
@import './ChapterNav';
</style>