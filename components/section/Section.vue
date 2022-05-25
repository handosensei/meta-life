<template>
  <section
    class="section"
    :class="[activeChapter.id, theme === 'light' ? 'isLight' : menuAnimating]"
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
    <component :is="component.name" ref="component" v-bind="component" />
  </section>
</template>

<script>
import sniffer from '@antinomy-studio/sniffer';
import { gsap } from 'gsap';
import { mapActions, mapState } from 'vuex';

import delay from '~/utils/functions/delay';
import normalizeWheel from '~/utils/functions/normalizeWheel';

import SectionGallery from '~/components/gallery/Gallery.vue';
import SectionHeading from '~/components/heading/Heading.vue';
import SectionIntro from '~/components/intro/Intro.vue';
import SectionText from '~/components/text/Text.vue';

const WHEEL_THRESHOLD = 10;

export default {
  name: 'SectionComponent',

  components: {
    SectionGallery,
    SectionHeading,
    SectionIntro,
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

  data() {
    return {
      menuAnimating: false,
    };
  },

  computed: {
    ...mapState('app', ['theme', 'menuOpen', 'windowSize']),
    ...mapState('home', ['chapters', 'activeChapter', 'activeSection', 'galleryOpen']),
  },

  watch: {
    theme: 'onThemeChange',
  },

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    onWheel(event) {
      if (this.isNavigating || this.menuOpen || this.galleryOpen) {
        return;
      }

      const { pixelY } = normalizeWheel(event);

      if (pixelY > WHEEL_THRESHOLD || pixelY < -WHEEL_THRESHOLD) {
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
      this.touchEvent = sniffer.isTouch && event.type !== 'mousemove' ? event.touches?.[0] || event.changedTouches?.[0] : event;
      this.dragStart = this.touchEvent?.clientY;
      this.delta = 0;
    },

    onDrag(event) {
      if (!this.isDragging) return;

      this.touchEvent = sniffer.isTouch && event.type !== 'mousemove' ? event.touches?.[0] || event.changedTouches?.[0] : event;
      this.delta = this.touchEvent?.clientY - this.dragStart;
    },

    onDragEnd() {
      if (!this.isDragging) return;

      this.isDragging = false;
      const multiply = sniffer.isTouch ? 5 : 8;

      if (Math.abs(this.delta) > this.windowSize.height / multiply) {
        if (this.delta < 0) {
          this.navigate(1);
        } else {
          this.navigate(-1);
        }
      }
    },

    onKeyDown({ key }) {
      if (this.isNavigating || this.menuOpen || this.galleryOpen) {
        return;
      }

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        this.navigate(1);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        this.navigate(-1);
      }
    },

    async onThemeChange() {
      if (this.menuOpen) {
        this.menuAnimating = true;

        await delay(this.$root.menuTransitionDuration);

        this.menuAnimating = false;
      }
    },

    getEnterTl() {
      const tl = gsap.timeline();
      const componentTl = this.$refs.component.getEnterTl();

      tl.addLabel('start')
        .call(() => {
          window.canvas.props.target = parseInt(this.activeChapter.webgl);
          this.$root.$emit('background:switchColor', this.activeSection.theme);
        })
        .add(componentTl, 'start');

      return tl;
    },

    getLeaveTl() {
      const tl = gsap.timeline();
      const componentTl = this.$refs.component.getLeaveTl();

      tl.add(componentTl);

      return tl;
    },

    ...mapActions('home', ['setActiveChapter', 'setActiveSection']),
  },
};
</script>

<style lang="scss" scoped>
@import './Section';
</style>
