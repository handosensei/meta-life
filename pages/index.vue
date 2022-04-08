<template>
  <main>
    <transition
      name="sectionTransition"
      mode="out-in"
      :css="false"
      @enter="onSectionEnter"
      @leave="onSectionLeave"
    >
      <Section
        ref="section"
        :key="activeSection.id"
        v-bind="activeSection"
        :navigate="navigate"
        :is-navigating="isNavigating"
        :set-is-navigating="setIsNavigating"
      />
    </transition>

    <transition
      name="galleryOverlayTransition"
      :css="false"
      @enter="onGalleryOverlayEnter"
      @leave="onGalleryOverlayLeave"
    >
      <GalleryOverlay
        v-if="galleryOpen"
        :active-item="activeGalleryItem"
        :set-active-item="setActiveGalleryItem"
      />
    </transition>

    <TunnelSquares ref="tunnelSquares" />
    <Background />
    <Footer v-if="activeSection.footerVisible" />
    <ChapterNav v-if="!activeSection.navHidden" />
    <Footer v-if="activeSection.footerVisible" />
  </main>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import { goToNextSection, goToPreviousSection } from '~/utils/functions/chapterHelpers';
import delay from '~/utils/functions/delay';

import Background from '~/components/background/Background.vue';
import ChapterNav from '~/components/chapterNav/ChapterNav.vue';
import Footer from '~/components/footer/Footer.vue';
import GalleryOverlay from '~/components/galleryOverlay/GalleryOverlay.vue';
import Section from '~/components/section/Section.vue';
import TunnelSquares from '~/components/tunnelSquares/TunnelSquares.vue';

export default {
  name: 'IndexPage',

  components: {
    Background,
    ChapterNav,
    Footer,
    GalleryOverlay,
    Section,
    TunnelSquares,
  },

  data() {
    return {
      isNavigating: false,
    };
  },

  computed: {
    ...mapState('app', ['menuOpen']),
    ...mapState('home', ['chapters', 'activeChapter', 'activeSection', 'galleryOpen']),
  },

  watch: {
    activeSection: 'onSectionChange',
  },

  created() {
    this.setActiveChapter(this.chapters[0]);
    this.setActiveSection(this.chapters[0].sections[0]);
    this.setActiveChapterByUrlQuery();
  },

  mounted() {
    this.$root.$on('galleryOverlay:toggle', this.onToggleGalleryOverlay);
    this.onSectionEnter();
  },

  beforeDestroy() {
    this.$root.$off('galleryOverlay:toggle', this.onToggleGalleryOverlay);
  },

  methods: {
    onSectionChange() {
      this.setTheme(this.activeSection.theme || 'dark');
    },

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
      if (this.isNavigating || this.menuOpen || this.galleryOpen) {
        return;
      }

      this.setIsNavigating(true);

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

      this.$refs.tunnelSquares.animate(dir);

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

    onGalleryOverlayEnter(el) {
      gsap.fromTo(
        el,
        { autoAlpha: 0 },
        { autoAlpha: 1 },
      );
    },

    onGalleryOverlayLeave(el, done) {
      gsap.fromTo(
        el,
        { autoAlpha: 1 },
        { autoAlpha: 0, onComplete: done },
      );
    },

    onSectionLeave(el, done) {
      const tl = gsap.timeline({ onComplete: done });
      const sectionTl = this.$refs.section.getLeaveTl();

      tl.add(sectionTl);
    },

    onSectionEnter(el) {
      const tl = gsap.timeline();
      const sectionTl = this.$refs.section.getEnterTl();

      tl.add(sectionTl);
    },

    ...mapActions('app', ['setTheme']),
    ...mapActions('home', ['setActiveChapter', 'setActiveSection', 'setGalleryOpen']),
  },
};
</script>
