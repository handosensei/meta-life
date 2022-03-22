<template>
  <nav class="chapterNav">
    <ul class="navList">
      <li
        v-for="chapter in chapters"
        :key="chapter.id"
        class="navItem"
        :class="{ 'isActive': chapter === activeChapter }"
      >
        <button
          v-if="!chapter.hideInNav"
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