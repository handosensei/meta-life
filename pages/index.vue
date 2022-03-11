<template>
  <main>
    <Section v-bind="activeSection" />
    <Footer v-if="activeSection.footerVisible" />
    <ChapterNav v-if="!activeSection.navHidden" />
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import { goToNextSection, goToPreviousSection } from '~/utils/functions/chapterHelpers';
import delay from '~/utils/functions/delay';
import normalizeWheel from '~/utils/functions/normalizeWheel';

import ChapterNav from '~/components/chapterNav/ChapterNav.vue';
import Footer from '~/components/footer/Footer.vue';
import Section from '~/components/section/Section.vue';

const WHEEL_THRESHOLD = 10;

export default {
  name: 'IndexPage',

  components: {
    ChapterNav,
    Footer,
    Section,
  },

  data() {
    return {
      isNavigation: false,
    };
  },

  computed: {
    ...mapState('home', ['chapters', 'activeChapter', 'activeSection']),
  },

  watch: {
    activeSection: 'onSectionChange',
  },

  created() {
    this.setActiveChapterByUrlQuery();
  },

  mounted() {
    window.addEventListener('wheel', this.onWheel);
    window.addEventListener('keydown', this.onKeyDown);
  },

  beforeDestroy() {
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    setActiveChapterByUrlQuery() {
      const { chapter: chapterId } = this.$router.history.current.query;
      const chapter = this.chapters.find(({ id }) => id === chapterId);
      const chapterExists = !!chapter;

      if (chapterExists) {
        this.setActiveChapter(chapter);
        this.setActiveSection(chapter.sections[0]);
      }
    },

    onSectionChange() {
      this.setTheme(this.activeSection.theme || 'dark');
    },

    onWheel(event) {
      if (this.isNavigating) {
        return;
      }

      const { pixelY } = normalizeWheel(event);

      if ((pixelY > WHEEL_THRESHOLD || pixelY < -WHEEL_THRESHOLD)) {
        this.isNavigating = true;

        if (pixelY > WHEEL_THRESHOLD) {
          this.navigate(1);
        } else {
          this.navigate(-1);
        }
      }
    },

    onKeyDown({ key }) {
      if (this.isNavigating) {
        return;
      }

      this.isNavigating = true;

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        this.navigate(1);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        this.navigate(-1);
      }
    },

    async navigate(dir) {
      if (dir === -1) {
        const { chapter, section } = goToPreviousSection(this.chapters, this.activeChapter, this.activeSection);
        this.setActiveChapter(chapter);
        this.setActiveSection(section);
      }

      if (dir === 1) {
        const { chapter, section } = goToNextSection(this.chapters, this.activeChapter, this.activeSection);
        this.setActiveChapter(chapter);
        this.setActiveSection(section);
      }

      await delay(1000);

      this.isNavigating = false;
    },

    ...mapActions('app', ['setTheme']),
    ...mapActions('home', ['setActiveChapter', 'setActiveSection']),
  },
};
</script>
