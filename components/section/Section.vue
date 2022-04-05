<template>
  <section
    class="section"
    :class="{ 'isLight': theme === 'light' }"
    @mousedown="onDragStart"
    @touchstart.passive="onDragStart"
    @mousemove="onDrag"
    @touchmove.passive="onDrag"
    @mouseup="onDragEnd"
    @touchend.passive="onDragEnd"
    @touchleave.passive="onDragEnd"
    @mouseleave="onDragEnd"
    @wheel="onWheel"
  >
    <component :is="component.name" v-bind="component" />
  </section>
</template>

<script>
import sniffer from '@antinomy-studio/sniffer';
import { mapActions, mapState } from 'vuex';

import normalizeWheel from '~/utils/functions/normalizeWheel';

import SectionGallery from '~/components/gallery/Gallery.vue';
import SectionHeading from '~/components/heading/Heading.vue';
import SectionText from '~/components/text/Text.vue';

const WHEEL_THRESHOLD = 10;

export default {
  name: 'SectionComponent',

  components: {
    SectionGallery,
    SectionHeading,
    SectionText,
  },

  props: {
    component: {
      type: Object,
      required: true,
    },

    id: {
      type: String,
      required: true,
    },

    isNavigating: {
      type: Boolean,
      required: true,
    },

    navigate: {
      type: Function,
      required: true,
    },

    setIsNavigating: {
      type: Function,
      required: true,
    },
  },

  computed: {
    ...mapState('app', ['theme', 'menuOpen', 'windowSize']),
    ...mapState('home', ['chapters', 'activeChapter', 'activeSection', 'galleryOpen']),
  },

  watch: {
    activeSection: 'onSectionChange',
  },

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    onSectionChange() {
      this.setTheme(this.activeSection.theme || 'dark');
    },

    onWheel(event) {
      if (this.isNavigating || this.menuOpen || this.galleryOpen) {
        return;
      }

      const { pixelY } = normalizeWheel(event);

      if ((pixelY > WHEEL_THRESHOLD || pixelY < -WHEEL_THRESHOLD)) {
        this.setIsNavigating(true);

        if (pixelY > WHEEL_THRESHOLD) {
          this.navigate(1);
        } else {
          this.navigate(-1);
        }
      }
    },

    onDragStart(event) {
      if (this.isNavigating || this.menuOpen || this.galleryOpen) {
        return;
      }

      this.isDragging = true;
      this.touchEvent = sniffer.isTouch && event.type !== 'mousemove' ? (event.touches?.[0] || event.changedTouches?.[0]) : event;
      this.dragStart = this.touchEvent?.clientY;
      this.delta = 0;
    },

    onDrag(event) {
      if (!this.isDragging) return;

      this.touchEvent = sniffer.isTouch && event.type !== 'mousemove' ? (event.touches?.[0] || event.changedTouches?.[0]) : event;
      this.delta = this.touchEvent?.clientY - this.dragStart;
    },

    onDragEnd() {
      if (!this.isDragging) return;

      this.isDragging = false;
      const multiply = (sniffer.isTouch) ? 5 : 8;

      if (Math.abs(this.delta) > this.windowSize.height / multiply) {
        if (this.delta < 0) {
          this.setIsNavigating(true);
          this.navigate(1);
        } else {
          this.setIsNavigating(true);
          this.navigate(-1);
        }
      }
    },


    onKeyDown({ key }) {
      if (this.isNavigating || this.menuOpen || this.galleryOpen) {
        return;
      }

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        this.setIsNavigating(true);
        this.navigate(1);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        this.setIsNavigating(true);
        this.navigate(-1);
      }
    },

    ...mapActions('app', ['setTheme']),
    ...mapActions('home', ['setActiveChapter', 'setActiveSection']),
  },
}
</script>

<style lang="scss" scoped>
@import './Section';
</style>