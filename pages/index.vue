<template>
  <main>
    <Section
      v-bind="activeSection"
      :navigate="navigate"
      :is-navigating="isNavigating"
      :set-is-navigating="setIsNavigating"
    />
    <transition
      name="galleryOverlayTransition"
      :css="false"
      @enter="onEnterGalleryOverlay"
      @leave="onLeaveGalleryOverlay"
    >
      <GalleryOverlay
        v-if="galleryOpen"
        :active-item="activeGalleryItem"
        :set-active-item="setActiveGalleryItem"
      />
    </transition>
    <Footer v-if="activeSection.footerVisible" />
    <ChapterNav v-if="!activeSection.navHidden" />
  </main>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import { goToNextSection, goToPreviousSection } from '~/utils/functions/chapterHelpers';
import delay from '~/utils/functions/delay';

import ChapterNav from '~/components/chapterNav/ChapterNav.vue';
import Footer from '~/components/footer/Footer.vue';
import GalleryOverlay from '~/components/galleryOverlay/GalleryOverlay.vue';
import Section from '~/components/section/Section.vue';

export default {
  name: 'IndexPage',

  components: {
    ChapterNav,
    Footer,
    GalleryOverlay,
    Section,
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
    this.setActiveChapter(this.chapters[0]);
    this.setActiveSection(this.chapters[0].sections[0]);
    this.setActiveChapterByUrlQuery();
  },

  mounted() {
    this.$root.$on('galleryOverlay:toggle', this.onToggleGalleryOverlay);
  },

  beforeDestroy() {
    this.$root.$off('galleryOverlay:toggle', this.onToggleGalleryOverlay);
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

    setActiveGalleryItem(item) {
      if (item === this.activeGalleryItem) {
        return;
      }

      this.activeGalleryItem = item;
    },
    
    onToggleGalleryOverlay(item) {
      this.activeGalleryItem = item;
      this.setGalleryOpen(!this.galleryOpen);

      if (this.galleryOpen) {
        this.setTheme('dark');
      } else {
        this.setTheme(this.activeSection.theme);
      }
    },

    onEnterGalleryOverlay(el) {
      gsap.fromTo(
        el,
        { autoAlpha: 0 },
        { autoAlpha: 1 },
      );
    },

    onLeaveGalleryOverlay(el, done) {
      gsap.fromTo(
        el,
        { autoAlpha: 1 },
        { autoAlpha: 0, onComplete: done },
      );
    },

    ...mapActions('app', ['setTheme']),
    ...mapActions('home', ['setActiveChapter', 'setActiveSection', 'setGalleryOpen']),
  },
};
</script>
