<template>
  <FocusLock :disabled="!galleryOpen || menuOpen">
    <div
      v-touch:swipe.left="
        () => {
          changeSlide(-1);
        }
      "
      v-touch:swipe.right="
        () => {
          changeSlide(-1);
        }
      "
      class="galleryOverlay"
    >
      <transition :css="false" name="galleryOverlayContentTransition" @enter="onEnterContent" @leave="onLeaveContent">
        <div ref="content" :key="typeof activeSlide?.image?.highres?.src !== 'undefined' ? activeSlide.image.highres.src : activeSlide.video.src" class="content">
          <div class="head">
            <div class="title">{{ activeSlide.title }}</div>
            <!-- <div class="subtitle">{{ activeItem.category }}</div> -->
          </div>
          <p ref="text" class="text">{{ activeSlide.text }}</p>
        </div>
      </transition>

      <div class="backgroundImages" :class="activeSlide?.image?.highres?.fullscreen ? 'fullscreen' : ''">
        <Icon class="navButton left" type="ChevronLeft" @click.native="changeSlide(-1)" />
        <Icon class="navButton right" type="ChevronRight" @click.native="changeSlide(1)" />
        <transition :css="false" name="galleryOverlayImageTransition" @enter="onEnterImage" @leave="onLeaveImage">
          <img
            v-if="typeof activeSlide?.image !== 'undefined'"
            :key="activeSlide.image.highres.src"
            class="backgroundImage"
            :class="activeSlide.image.highres?.fullscreen ? 'fullscreen' : ''"
            :src="activeSlide.image.highres.src"
            :alt="activeSlide.image.highres.alt"
          />
          <video
            v-else
            :key="activeSlide.video.src"
            class="videoContainer"
            controls
            muted
            autoplay
            loop
            controlsList="nodownload noremoteplayback noplaybackrate"
            disablePictureInPicture
            :poster="activeSlide.video.thumb"
          >
            <source :src="activeSlide.video.src" type="video/mp4" />
          </video>
        </transition>
      </div>

      <IconButton ref="close" as="button" class="closeButton right" icon="CloseButton" aria-label="close gallery button" @click.native="onClose" />

      <nav class="nav">
        <button class="backButton" type="button" @click="onClose">
          <Icon class="closeIcon" type="Close" />
          Back to the Experience
        </button>
      </nav>
    </div>
  </FocusLock>
</template>

<script>
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import FocusLock from 'vue-focus-lock';
import { mapActions, mapState } from 'vuex';

import Icon from '~/components/elements/Icon.vue';
import IconButton from '~/components/elements/IconButton.vue';

export default {
  name: 'GalleryOverlayComponent',

  components: {
    FocusLock,
    Icon,
    IconButton,
  },

  props: {
    activeItem: {
      type: Object,
      required: true,
    },

    setActiveItem: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      activeSlide: this.activeItem.slides[0],
    };
  },

  computed: {
    ...mapState('app', ['menuOpen']),
    ...mapState('home', ['galleryOpen', 'activeSection']),
  },

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);

    gsap.to('.header', { autoAlpha: 0, ease: 'none', duration: 0.3 });
    gsap.to(this.$refs.close.$el, { autoAlpha: 1, ease: 'none', duration: 0.3 });

    this.$nuxt.$emit(
      'assetsLoader:load',
      this.activeItem.slides.map((img) => (typeof img?.image?.highres?.src !== 'undefined' ? img.image.highres.src : img.video))
    );
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    setActiveSlide(slide) {
      if (this.activeSlide === slide) {
        return;
      }

      this.activeSlide = slide;
    },

    changeSlide(direction) {
      const currentIndex = this.activeItem.slides.indexOf(this.activeSlide, 0);
      if (direction === 1) {
        const nextIndex = (currentIndex + 1) % this.activeItem.slides.length;
        const nextItem = this.activeItem.slides[nextIndex];

        this.setActiveSlide(nextItem);
      } else if (direction === -1) {
        let prevIndex;
        if (currentIndex === 0) {
          prevIndex = this.activeItem.slides.length - 1;
        } else {
          prevIndex = currentIndex - 1;
        }
        const prevItem = this.activeItem.slides[prevIndex];
        this.setActiveSlide(prevItem);
      }
    },

    onKeyDown({ key }) {
      if (key === 'Escape' && !this.menuOpen) {
        this.$root.$emit('galleryOverlay:toggle', '');
        this.setTheme(this.activeSection.theme);
      }
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        this.changeSlide(1);
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        this.changeSlide(-1);
      }
    },

    onClose() {
      gsap.to('.header', { autoAlpha: 1, ease: 'none', duration: 0.3 });
      gsap.to(this.$refs.close.$el, { autoAlpha: 0, ease: 'none', duration: 0.3 });
      gsap.to(this.$refs.content, { autoAlpha: 0, ease: 'none', duration: 0.3 });
      this.$root.$emit('galleryOverlay:toggle', '');
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    },

    onEnterImage(el) {
      gsap.fromTo(el, { scale: 1.5, autoAlpha: 0 }, { scale: 1, duration: 2, autoAlpha: 1, ease: 'expo.out' });
    },

    onLeaveImage(el, done) {
      gsap.fromTo(el, { autoAlpha: 1 }, { autoAlpha: 0, duration: 2, ease: 'expo.out', onComplete: done });
    },

    onEnterContent(el) {
      const title = el.querySelector('.title');
      const subtitle = el.querySelector('.subtitle');
      const text = el.querySelector('.text');

      this.splitText = new SplitText(text, {
        type: 'lines',
        linesClass: 'text-line',
      });

      const tl = gsap.timeline({ defaults: { duration: 1, ease: 'expo.out' } });

      tl.fromTo([title, subtitle], { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.2 }, 0.5).fromTo(
        this.splitText.lines,
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, stagger: 0.1 },
        0.5
      );
    },

    onLeaveContent(el, done) {
      gsap.fromTo(el, { autoAlpha: 1 }, { autoAlpha: 0, onComplete: done });
    },

    ...mapActions('app', ['setTheme']),
  },
};
</script>

<style lang="scss" scoped>
@import './GalleryOverlay';
</style>
