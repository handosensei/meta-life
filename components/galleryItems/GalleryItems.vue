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
        <img
          ref="galleryImage"
          class="galleryImage"
          :src="typeof galleryItem.slides[0]?.image !== 'undefined' ? galleryItem.slides[0]?.image.thumb.src : galleryItem.slides[0]?.video.thumb"
          :alt="galleryItem.slides[0].title"
        />
      </div>
      <Icon ref="galleryPlus" class="galleryPlus" type="Plus" />
      <Icon ref="gallerySphere" class="gallerySphere" type="Sphere" />
      <Icon ref="galleryBigSphere" class="galleryBigSphere gallerySphere" type="bigSphere" />
    </button>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
    this.bigCircleAnimation = [];

    gsap.to(this.$refs.galleryImage, { rotate: 360, ease: 'linear', repeat: -1, duration: 20 });
    gsap.to(this.$refs.galleryMask, { rotate: -360, ease: 'linear', repeat: -1, duration: 20 });

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
      '(min-width: 768px)': () => {
        this.isMobile = false;
      },
      '(max-width: 767px)': () => {
        this.isMobile = true;
      },
    });
    this.buttonAnimation = gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 2.5 });

    for (let i = 0; i < this.galleryItems.length; i++) {
      this.bigCircleAnimation[i] = gsap.timeline();
      this.bigCircleAnimation[i].fromTo(
        [this.galleryBigSphere[i * 2], this.galleryBigSphere[i * 2 + 1]],

        {
          attr: { r: this.isMobile ? 40 : 65 },
        },
        {
          attr: { r: this.isMobile ? 45 : 80 },
          ease: 'power1.inOut',
          duration: 1,
          yoyo: true,
          repeat: -1,
        }
      );

      this.buttonAnimation.call(
        () => {
          this.onMouseEnter(i, false);
        },
        null,
        '+=0.75'
      );
      this.buttonAnimation.call(
        () => {
          this.onMouseLeave(i);
        },
        null,
        '+=2'
      );

      gsap.set(this.$refs.label[i], { y: this.isMobile ? -20 : 10 });
    }

    this.sound = new Audio('/audio/itemHover.mp3');
  },

  beforeDestroy() {
    for (let i = 0; i < this.galleryItems.length; i++) {
      this.bigCircleAnimation[i].kill();
    }
    this.buttonAnimation.kill();
    this.sound.removeAttribute('src');
    this.sound.load();
  },

  methods: {
    onToggleOverlay(item) {
      this.$root.$emit('galleryOverlay:toggle', item);
    },

    onMouseEnter(id, sound = true) {
      if (this.$refs.gallerySphere[id] && this.$refs.gallerySphere[id].$el) {
        const mask = this.$refs.galleryMask[id];
        const circles = this.$refs.gallerySphere[id].$el.querySelectorAll('.js-circle');
        const bigCircles = this.$refs.galleryBigSphere[id].$el.querySelectorAll('.js-circle');

        this.bigCircleAnimation[id].pause();
        gsap.killTweensOf([...circles, this.$refs.gallerySphere[id].$el.lastChild]);
        gsap.to(mask, {
          autoAlpha: 1,
          duration: 0.65,
          ease: 'expo.out',
          delay: 0.15,
        });
        gsap.to(this.$refs.label[id], { y: this.isMobile ? -20 : 20, duration: 0.75, ease: 'expo.out' });
        gsap.fromTo(
          circles,
          {
            attr: {
              r: this.isMobile ? 25 : 55,
            },
          },
          {
            attr: {
              r: this.isMobile ? 35 : 70,
              duration: 0.75,
              ease: 'expo.out',
            },
            onComplete: () => {
              if (this.$refs.gallerySphere[id].$el.lastChild) {
                gsap.fromTo(
                  this.$refs.gallerySphere[id].$el.lastChild,
                  { drawSVG: '0%', rotate: -90, transformOrigin: 'center', visibility: 'visible' },
                  { drawSVG: '100%', rotate: 90, duration: 1.5, ease: 'expo.out' }
                );
              }
            },
          }
        );

        gsap.fromTo(
          bigCircles,
          {
            attr: {
              r: this.isMobile ? 40 : 65,
            },
          },
          {
            attr: {
              r: this.isMobile ? 50 : 100,
              duration: 0.75,
              ease: 'expo.out',
            },
            onComplete: () => {
              if (this.$refs.galleryBigSphere[id].$el.lastChild) {
                gsap.fromTo(
                  this.$refs.galleryBigSphere[id].$el.lastChild,
                  { drawSVG: '0%', rotate: -90, transformOrigin: 'center', visibility: 'visible' },
                  { drawSVG: '-100%', rotate: 90, duration: 1.5, ease: 'expo.out' }
                );
              }
            },
          }
        );

        if (this.audio && sound) {
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
        gsap.to(this.$refs.label[id], { y: this.isMobile ? -20 : 10, duration: 0.75, ease: 'expo.out' });
        gsap.to(circles, {
          attr: {
            r: this.isMobile ? 25 : 50,
            duration: 0.75,
            ease: 'expo.out',
          },
          onComplete: () => {
            gsap.fromTo(
              this.$refs.gallerySphere[id].$el?.lastChild,
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
            r: this.isMobile ? 50 : 65,
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
        this.bigCircleAnimation[id].restart();
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
