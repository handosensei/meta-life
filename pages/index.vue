<template>
  <main>
    <Section
      v-bind="activeSection"
      :navigate="navigate"
      :is-navigating="isNavigating"
      :set-is-navigating="setIsNavigating"
    />
    <Footer v-if="activeSection.footerVisible" />
    <ChapterNav v-if="!activeSection.navHidden" />
    <Webgl />
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import { goToNextSection, goToPreviousSection } from '~/utils/functions/chapterHelpers';
import delay from '~/utils/functions/delay';

import ChapterNav from '~/components/chapterNav/ChapterNav.vue';
import Footer from '~/components/footer/Footer.vue';
import Section from '~/components/section/Section.vue';
import Webgl from '~/components/webgl/Webgl.vue';

export default {
  name: 'IndexPage',

  components: {
    ChapterNav,
    Footer,
    Section,
    Webgl,
  },

  data() {
    return {
      isNavigating: false,
    };
  },

  computed: {
    ...mapState('home', ['chapters', 'activeChapter', 'activeSection', 'galleryOpen']),
  },

  created() {
    this.setActiveChapterByUrlQuery();
  },

  methods: {
    setActiveChapterByUrlQuery() {
      const { chapter: chapterId } = this.$router.history.current.query;
      const chapter = this.chapters.find(({ id }) => id === chapterId);
      const chapterExists = !!chapter;

      if (chapterExists) {
        this.setActiveChapter(chapter);
        this.setActiveSection(chapter.sections[0]);
        this.setTheme(this.activeSection.theme || 'dark');
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

      this.setIsNavigating(false);
    },

    setIsNavigating(bool) {
      this.isNavigating = bool;
    },

    ...mapActions('app', ['setTheme']),
    ...mapActions('home', ['setActiveChapter', 'setActiveSection']),
  },
};
</script>
