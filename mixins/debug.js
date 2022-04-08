import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('home', ['chapters', 'activeChapter', 'activeSection']),
  },

  created() {
    this.setActiveChapterByUrlQuery();
    this.checkSkipIntro();
  },

  methods: {
    checkSkipIntro() {
      const { skipIntro } = this.$router.history.current.query;

      if (skipIntro) {
        this.setAssetsPreloaded();
        this.setPreloaderVisible(false);
        this.setIntroSkipped(true);
      }
    },

    setActiveChapterByUrlQuery() {
      if (this.$route.name !== 'index') {
        return;
      }

      const { chapter: chapterId } = this.$router.history.current.query;
      const chapter = this.chapters.find(({ id }) => id === chapterId);
      const chapterExists = !!chapter;

      if (chapterExists) {
        this.setActiveChapter(chapter);
        this.setActiveSection(chapter.sections[0]);
        this.setTheme(this.activeSection.theme || 'dark');
      }
    },

    ...mapActions('app', ['setAssetsPreloaded', 'setPreloaderVisible', 'setIntroSkipped', 'setTheme']),
    ...mapActions('home', ['setActiveChapter', 'setActiveSection']),
  },
};
