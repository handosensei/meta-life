<template>
  <div class="galleryItems">
    <button
      v-for="(galleryItem, id) in galleryItems"
      ref="button"
      :key="galleryItem.id"
      class="galleryItem"
      type="button"
      :aria-label="`open ${galleryItem.category} gallery album`"
      :disabled="galleryItemsDisabled"
      @click="onToggleOverlay(galleryItem)"
      @mouseenter="onMouseEnter(id)"
      @mouseleave="onMouseLeave(id)"
    >
      <span ref="label" class>{{ galleryItem.category }}</span>
      <div ref="galleryMask" class="galleryMask">
        <img ref="galleryImage" class="galleryImage" :src="galleryItem.slides[0].image.thumb.src" :alt="galleryItem.slides[0].image.thumb.alt" />
      </div>
      <Icon ref="galleryPlus" class="galleryPlus" type="Plus" />
      <Icon ref="gallerySphere" class="gallerySphere" type="Sphere" />
      <Icon ref="galleryBigSphere" class="galleryBigSphere gallerySphere" type="bigSphere" />
    </button>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { mapState } from 'vuex';

import Icon from '~/components/elements/Icon.vue';

export default {
  components: {
    Icon,
  },

  props: {
    galleryItems: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data: () => ({
    galleryItemsDisabled: true,
  }),

  computed: {
    ...mapState('home', ['audio']),
  },

  mounted() {
    this.gallerySphere = this.$el.querySelectorAll('.gallerySphere circle');
    this.galleryBigSphere = this.$el.querySelectorAll('.galleryBigSphere circle');
    this.galleryPlus = this.$el.querySelectorAll('.galleryPlus');

    gsap.to(this.$refs.galleryImage, { rotate: 360, ease: 'linear', repeat: -1, duration: 20 });
    gsap.to(this.$refs.galleryMask, { rotate: -360, ease: 'linear', repeat: -1, duration: 20 });
    this.bigCircleAnimation = gsap.timeline()
    this.bigCircleAnimation.fromTo(
      this.galleryBigSphere,
      {
        attr: {
          r: 45,
        },
      },
      {
        attr: {
          r: 55,
        },
        ease: 'power1.inOut',
        duration: 1,
        yoyo: true,
        repeat: -1,
      }
    );
    this.sound = new Audio('/audio/sound.mp3');
  },

  beforeDestroy() {
    this.sound.removeAttribute('src');
    this.sound.load();
  },

  methods: {
    onToggleOverlay(item) {
      this.$root.$emit('galleryOverlay:toggle', item);
    },

    onMouseEnter(id) {
      if (this.$refs.gallerySphere[id] && this.$refs.gallerySphere[id].$el) {
        const mask = this.$refs.galleryMask[id];
        const circles = this.$refs.gallerySphere[id].$el.querySelectorAll('.js-circle');
        const bigCircles = this.$refs.galleryBigSphere[id].$el.querySelectorAll('.js-circle');
        gsap.killTweensOf([...circles, this.$refs.gallerySphere[id].$el.lastChild]);
        gsap.to(mask, {
          autoAlpha: 1,
          duration: 0.65,
          ease: 'expo.out',
          delay: 0.15,
        });
        gsap.to(this.$refs.label[id], { y: 20, duration: 0.75, ease: 'expo.out' });
        gsap.to(circles, {
          attr: {
            r: 72,
            duration: 0.75,
            ease: 'expo.out',
          },
          onComplete: () => {
            gsap.fromTo(
              this.$refs.gallerySphere[id].$el.lastChild,
              { drawSVG: '0%', rotate: -90, transformOrigin: 'center', visibility: 'visible' },
              { drawSVG: '100%', rotate: 90, duration: 1.5, ease: 'expo.out' }
            );
          },
        });
        this.bigCircleAnimation.pause();
        gsap.to(bigCircles, {
          attr: {
            r: 102,
            duration: 0.75,
            ease: 'expo.out',
          },
          onComplete: () => {
            gsap.fromTo(
              this.$refs.galleryBigSphere[id].$el.lastChild,
              { drawSVG: '0%', rotate: -90, transformOrigin: 'center', visibility: 'visible' },
              { drawSVG: '-100%', rotate: 90, duration: 1.5, ease: 'expo.out' }
            );
          },
        });

        if (this.audio) {
          this.sound.currentTime = 0;
          this.sound.play();
        }
      }
    },

    onMouseLeave(id) {
      if (this.$refs.gallerySphere[id] && this.$refs.gallerySphere[id].$el) {
        const mask = this.$refs.galleryMask[id];
        const circles = this.$refs.gallerySphere[id].$el.querySelectorAll('.js-circle');
        const bigCircles = this.$refs.galleryBigSphere[id].$el.querySelectorAll('.js-circle');
        gsap.killTweensOf([...circles, this.$refs.gallerySphere[id].$el.lastChild]);
        gsap.to(mask, {
          autoAlpha: 0,
          duration: 0.65,
          ease: 'expo.out',
        });
        gsap.to(this.$refs.label[id], { y: 0, duration: 0.75, ease: 'expo.out' });
        gsap.to(circles, {
          attr: {
            r: 25,
            duration: 0.75,
            ease: 'expo.out',
          },
          onComplete: () => {
            gsap.fromTo(
              this.$refs.gallerySphere[id].$el.lastChild,
              {
                drawSVG: '-100%',
                rotate: 90,
                transformOrigin: 'center',
              },
              {
                drawSVG: '0%',
                rotate: 270,
                duration: 1.5,
                ease: 'expo.out',
              }
            );
          },
        });

        
        gsap.to(bigCircles, {
          attr: {
            r: 55,
            duration: 0.75,
            ease: 'expo.out',
          },
          onComplete: () => {
            gsap.fromTo(
              this.$refs.galleryBigSphere[id].$el.lastChild,
              {
                drawSVG: '100%',
                rotate: 90,
                transformOrigin: 'center',
              },
              {
                drawSVG: '0%',
                rotate: 270,
                duration: 1.5,
                ease: 'expo.out',
              }
            );
          },
        });
        this.bigCircleAnimation.restart();
      }
    },

    getGalleryTl() {
      const galleryTl = gsap.timeline();

      const from = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)';
      const to = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

      galleryTl
        .fromTo(this.$refs.galleryMask, { clipPath: from }, { clipPath: to, duration: 2, stagger: { from: 'random', amount: 0.5 }, ease: 'expo.inOut' }, 0.5)
        .fromTo(
          this.gallerySphere,
          { drawSVG: '0%', rotate: -360, transformOrigin: 'center' },
          {
            drawSVG: '100%',
            rotate: 0,
            duration: 2,
            stagger: { from: 'random', amount: 0.5 },
            ease: 'expo.inOut',
            onComplete: () => {
              this.galleryItemsDisabled = false;
            },
          },
          0.5
        )
        .fromTo(this.galleryPlus, { autoAlpha: 0, rotate: 90 }, { autoAlpha: 1, rotate: 0, duration: 3, ease: 'expo.inOut' }, 1)
        .fromTo(this.$refs.label, { autoAlpha: 0 }, { autoAlpha: 0.75 }, 1);
      return galleryTl;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './GalleryItems';
</style>
