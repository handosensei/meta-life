<template>
  <nav class="chapterNav">
    <ul class="navList">
      <li
        v-for="chapter in visibleChapters"
        :key="chapter.id"
        class="navItem"
        :class="{ 'isActive': chapter === activeChapter }"
      >
        <button
          class="navButton"
          type="button"
          @click="onClick(chapter)"
        >
          <div class="buttonLabel">
            {{ chapter.name }}
          </div>
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
    visibleChapters() {
      return this.chapters.filter(({ hideInNav }) => !hideInNav);
    },

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