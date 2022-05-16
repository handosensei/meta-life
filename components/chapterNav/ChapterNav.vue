<template>
  <nav class="chapterNav" :class="{ isLight: theme === 'light', isDisabled: disabled }">
    <ul class="navList">
      <li v-for="(chapter, index) in visibleChapters" ref="navItems" :key="chapter.id" class="navItem" :class="{ isActive: chapter === activeChapter }">
        <button class="button" type="button" :disabled="activeChapterIndex === index" @click="onClick(chapter, index)">
          <svg v-if="mobileDisplay" viewBox="0 0 203 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 1.34315 1.34315 0 3 0H199.439C201.096 0 202.439 1.34315 202.439 3V36.5854L196.517 43.2927L190.594 50H2.99999C1.34314 50 0 48.6569 0 47V3Z" fill="white" fill-opacity="0.1"/>
          </svg>
          <div class="buttonLabel">
            {{ chapter.name }}
          </div>
          <div ref="actives" class="active">
            <div class="activeWrapper">
              <svg v-if="mobileDisplay" viewBox="0 0 203 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3C0 1.34315 1.34315 0 3 0H199.439C201.096 0 202.439 1.34315 202.439 3V36.5854L196.517 43.2927L190.594 50H2.99999C1.34314 50 0 48.6569 0 47V3Z" fill="white" fill-opacity="0.1"/>
              </svg>
              <div class="buttonLabel">
                {{ chapter.name }}
              </div>
              </div>
           </div>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import { getChapterIndex } from '~/utils/functions/chapterHelpers';
import BREAKPOINTS from '~/utils/config/breakpoints';
import delay from '~/utils/functions/delay';

export default {
  name: 'ChapterNavComponent',

  data() {
    return {
      bounds: [],
      disabled: false,
    };
  },

  computed: {
    visibleChapters() {
      return this.chapters.filter(({ hideInNav }) => !hideInNav);
    },

    ...mapState('app', ['theme', 'windowSize']),
    ...mapState('home', ['chapters', 'activeChapter', 'chapterNavOpen']),

    activeChapterIndex() {
      return getChapterIndex(this.chapters, this.activeChapter);
    },

    mobileDisplay() {
      return this.windowSize.width < BREAKPOINTS.s
    }
  },

  watch: {
    chapterNavOpen: 'toggleVisibility',
    activeChapter: 'switchActiveElement'
  },

  mounted() {
    const selectedElement = this.$refs.actives[this.activeChapterIndex]
    gsap.set(this.$refs.actives, {
      yPercent: -100
    })
    gsap.set(this.$refs.actives.map(element => element.querySelector('div')), {
      yPercent: 100
    })
    gsap.set([selectedElement, selectedElement.querySelector('div')], {
      yPercent: 0
    })
    this.$root.$on('window:resize', this.onResize);
    this.$root.$on('section:navigate', this.onSectionNavigation);
  },

  beforeDestroy() {
    this.$root.$off('window:resize', this.onResize);
    this.$root.$off('section:navigate', this.onSectionNavigation);
  },

  methods: {
    toggleVisibility() {
      gsap.to(this.$el, {autoAlpha: this.chapterNavOpen ? 1 : 0})
    },

    switchActiveElement(newChapter, oldChapter) {
      if (this.mobileDisplay) {
        this.disabled = true;
        const newActiveElement = this.$refs.actives[this.activeChapterIndex]
        const previousActiveElement = this.$refs.actives[getChapterIndex(this.chapters, oldChapter)];
        gsap.timeline({paused: true}).to(previousActiveElement, {
          yPercent: 100
        }, 0).to(previousActiveElement.querySelector('.activeWrapper'), {
          yPercent: -100
        }, 0).fromTo(newActiveElement, {
          yPercent: -100
        }, {
          yPercent: 0
        }, 0).fromTo(newActiveElement.querySelectorAll('.activeWrapper'), {
          yPercent: 100
        },{
          yPercent: 0
        }, 0).restart()
      }
    },

    onResize() {
      if (!this.mobileDisplay) {
        gsap.set(this.$el, { clearProps: 'all' });
      }
    },

    async onClick(chapter, index) {
      this.setActiveChapter(chapter);
      this.setActiveSection(chapter.sections[0]);
      await delay(500);
      this.mobileDisplay && this.$root.$emit('chapter-nav:toggle')
      this.disabled = false;
    },

    ...mapActions('home', ['setActiveChapter', 'setActiveSection']),
  },
};
</script>

<style lang="scss" scoped>
@import './ChapterNav';
</style>
