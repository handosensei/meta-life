<template>
  <main>
    <transition name="sectionTransition" mode="out-in" :css="false" @enter="onSectionEnter" @leave="onSectionLeave">
      <Section ref="section" :key="activeSection.id" v-bind="activeSection" :navigate="navigate" :is-navigating="isNavigating" :set-is-navigating="setIsNavigating" />
    </transition>

    <transition name="galleryOverlayTransition" :css="false" @enter="onGalleryOverlayEnter" @leave="onGalleryOverlayLeave">
      <GalleryOverlay v-if="galleryOpen" :active-item="activeGalleryItem" :set-active-item="setActiveGalleryItem" />
    </transition>

    <TunnelSquares ref="tunnelSquares" />

    <transition name="chapterNavTransition" :css="false" @enter="onChapterNavEnter" @leave="onChapterNavLeave">
      <ChapterNav v-if="!activeSection.navHidden" />
    </transition>
  </main>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import SEO from '~/mixins/seo';

import { goToNextSection, goToPreviousSection } from '~/utils/functions/chapterHelpers';
import delay from '~/utils/functions/delay';

// import Background from '~/components/background/Background.vue';
import ChapterNav from '~/components/chapterNav/ChapterNav.vue';
import GalleryOverlay from '~/components/galleryOverlay/GalleryOverlay.vue';
import Section from '~/components/section/Section.vue';
import TunnelSquares from '~/components/tunnelSquares/TunnelSquares.vue';

export default {
  name: 'IndexPage',

  components: {
    // Background,
    ChapterNav,
    GalleryOverlay,
    Section,
    TunnelSquares,
  },

  mixins: [Debug, PageTransition, SEO],

  data() {
    return {
      isNavigating: false,
    };
  },

  computed: {
    ...mapState('app', ['menuOpen', 'preloaderVisible']),
    ...mapState('home', ['chapters', 'activeChapter', 'activeSection', 'galleryOpen']),
  },

  watch: {
    activeSection: 'onSectionChange',
    preloaderVisible: 'onPageReady',
  },

  created() {
    this.setActiveChapter(this.chapters[0]);
    this.setActiveSection(this.chapters[0].sections[0]);
  },

  mounted() {
    this.$root.$on('galleryOverlay:toggle', this.onToggleGalleryOverlay);

    this.setTheme(this.activeSection.theme || 'dark');

    // If skipping the preloader through the url (skipIntro=true)
    if (!this.preloaderVisible) {
      this.onSectionEnter();
    }
  },

  beforeDestroy() {
    this.$root.$off('galleryOverlay:toggle', this.onToggleGalleryOverlay);
  },

  methods: {
    onPageReady() {
      if (!this.preloaderVisible) {
        this.onSectionEnter();
      }
    },

    onSectionChange() {
      setTimeout(() => {
        this.setTheme(this.activeSection.theme || 'dark');
      }, 500);
    },

    async navigate(dir) {
      if (this.isNavigating || this.menuOpen || this.galleryOpen) {
        return;
      }

      this.setIsNavigating(true);

      if (dir === -1) {
        const { chapter, section } = goToPreviousSection(this.chapters, this.activeChapter, this.activeSection);
        if (chapter.id !== this.activeChapter.id || section.id !== this.activeSection.id) {
          this.$refs.tunnelSquares.animate(dir);
        }
        this.setActiveChapter(chapter);
        this.setActiveSection(section);
      }

      if (dir === 1) {
        const { chapter, section } = goToNextSection(this.chapters, this.activeChapter, this.activeSection);
        if (chapter.id !== this.activeChapter.id || section.id !== this.activeSection.id) {
          this.$refs.tunnelSquares.animate(dir);
        }
        this.setActiveChapter(chapter);
        this.setActiveSection(section);
      }

      await delay(this.$root.sectionTransitionDuration);

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
      this.overlayTl = gsap.timeline();

      this.overlayTl
        .fromTo(
          el.querySelector('.backgroundImages'),
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: 'expo.inOut' },
          0
        )
        .fromTo(el.querySelector('.nav'), { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' }, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.2, ease: 'expo.out' }, 0.85)
        .fromTo(el.querySelector('.content').children, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.5, stagger: 0.2, ease: 'expo.inOut' }, 0.5)
        .fromTo(
          el.querySelectorAll('.navImage'),
          { clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' },
          { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', stagger: -0.1, duration: 1.5, ease: 'expo.inOut' },
          0.8
        );
    },

    onGalleryOverlayLeave(el, done) {
      const tlDuration = this.overlayTl.duration();
      this.overlayTl.reverse();
      gsap.delayedCall(tlDuration, done);
    },

    onChapterNavEnter(el) {
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1 });
    },

    onChapterNavLeave(el, done) {
      gsap.fromTo(el, { autoAlpha: 1 }, { autoAlpha: 0, onComplete: done });
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
