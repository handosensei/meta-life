<template>
  <section
    class="section"
    :class="{ 'isLight': theme === 'light' }"
  >
    <component :is="component.name" v-bind="component" />
  </section>
</template>

<script>
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
    ...mapState('app', ['theme']),
    ...mapState('home', ['chapters', 'activeChapter', 'activeSection', 'galleryOpen']),
  },

  watch: {
    activeSection: 'onSectionChange',
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
    onSectionChange() {
      this.setTheme(this.activeSection.theme || 'dark');
    },

    onWheel(event) {
      if (this.isNavigating) {
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

    onKeyDown({ key }) {
      if (this.isNavigating) {
        return;
      }

      this.setIsNavigating(true);

      if (!this.galleryOpen) {
        if (key === 'ArrowRight' || key === 'ArrowDown') {
          this.navigate(1);
        } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
          this.navigate(-1);
        }
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