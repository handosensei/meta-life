<template>
  <nav
    class="chapterNav"
    :class="{ 'isLight': theme === 'light' }"
  >
    <ul class="navList">
      <li
        v-for="chapter in visibleChapters"
        ref="navItems"
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
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import BREAKPOINTS from '~/utils/config/breakpoints';
import { getChapterIndex } from '~/utils/functions/chapterHelpers';

export default {
  name: 'ChapterNavComponent',

  data() {
    return {
      bounds: [],
    };
  },

  computed: {
    visibleChapters() {
      return this.chapters.filter(({ hideInNav }) => !hideInNav);
    },

    ...mapState('app', ['theme', 'windowSize']),
    ...mapState('home', ['chapters', 'activeChapter']),
  },

  watch: {
    activeChapter: 'onChapterChange',
  },

  mounted() {
    this.setBounds();
    this.$root.$on('window:resize', this.onResize);
  },

  beforeDestroy() {
    this.$root.$off('window:resize', this.onResize);
  },

  methods: {
    setBounds() {
      if (this.windowSize.width > BREAKPOINTS.s) {
        return;
      }

      this.$refs.navItems.forEach((navItem, index) => {
        const { width, x } = navItem.getBoundingClientRect();
        this.bounds.push({
          width,
          x,
        });
      });

      const firstChapterIndex = 0;
      const x = -this.bounds[firstChapterIndex].x + this.windowSize.width / 2 - this.bounds[firstChapterIndex].width / 2;
      gsap.set(this.$el, { x });
    },

    updatePosition() {
      if (this.windowSize.width > BREAKPOINTS.s) {
        return;
      }

      const activeChapterIndex = getChapterIndex(this.chapters, this.activeChapter) - 1;
      const x = -this.bounds[activeChapterIndex].x + this.windowSize.width / 2 - this.bounds[activeChapterIndex].width / 2;
      gsap.to(this.$el, { duration: 0.5, ease: 'power2.inOut', x });
    },

    onChapterChange() { 
      this.updatePosition();
    },

    onResize() {
      if (this.windowSize.width > BREAKPOINTS.s) {
        gsap.set(this.$el, { clearProps: 'all' });
      } else {
        this.setBounds();
        this.updatePosition();
      }
    },

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