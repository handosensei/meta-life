<template>
  <component
    :is="as"
    class="iconButton"
    :class="{ isFilled: filled }"
    :href="isLink ? href : null"
    :to="as === 'NuxtLink' ? href : null"
    :target="as === 'a' && target === '_blank' ? target : null"
    :type="as === 'button' ? type : null"
    :disabled="disabled"
    @click="onClick"
  >
    <span @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <Icon ref="icon" :type="icon" />
    </span>
  </component>
</template>

<script>
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

import Icon from '~/components/elements/Icon.vue';

if (process.client) {
  gsap.registerPlugin(DrawSVGPlugin);
}

export default {
  name: 'IconButtonComponent',

  components: {
    Icon,
  },

  props: {
    as: {
      type: String,
      required: false,
      default: 'NuxtLink',
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    filled: {
      type: Boolean,
      required: false,
      default: false,
    },

    href: {
      type: String,
      required: false,
      default: '',
    },

    icon: {
      type: String,
      required: true,
    },

    onClick: {
      type: Function,
      required: false,
      default: () => {},
    },

    target: {
      type: String,
      required: false,
      default: '_self',
    },

    type: {
      type: String,
      required: false,
      default: 'button',
    },
  },

  computed: {
    isLink() {
      return this.as === 'NuxtLink' || this.as === 'a';
    },
  },

  mounted() {
    this.iconEl = this.$refs.icon.$el;
    this.iconPath = this.iconEl.firstChild;
    this.init();
  },

  methods: {
    init() {
      gsap.set(this.iconPath, { drawSVG: '0%' });
    },

    onMouseEnter() {
      gsap.fromTo(this.iconPath, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'expo.out', duration: 0.5 });

      if (this.icon === 'MenuButton') {
        const lines = this.iconEl.querySelectorAll('line');

        gsap.fromTo([lines[0], lines[2]], { drawSVG: '100%' }, { drawSVG: '50%', ease: 'expo.out', stagger: 0.1, duration: 0.5 });
      }

      if (this.icon === 'CloseButton') {
        const lines = this.iconEl.querySelectorAll('path');

        gsap.fromTo(lines[1], { rotate: 0, transformOrigin: 'center' }, { rotate: 90, ease: 'expo.out', duration: 0.5 });
      }

      if (this.icon === 'NavButton') {
        const lines = this.$el.querySelectorAll('path');
        gsap.fromTo(lines[2], {
          attr: {d: 'M26 25H30V29H26V25ZM24 31V29H26V31H24ZM24 31V35H20V31H24ZM32 31H30V29H32V31ZM36 31H32V35H36V31ZM38 29V31H36V29H38ZM38 29H42V25H38V29Z'}
        },{
          attr: {d: "M26 31H30V35H26V31ZM24 31V29H26V31H24ZM24 29V25H20V29H24ZM32 31H30V29H32V31ZM36 29H32V25H36V29ZM38 29V31H36V29H38ZM38 31H42V35H38V31Z"},
          ease: 'linear',
          duration: 0,
          repeat: 6,
          yoyo: true,
          repeatDelay: 0.1
        })
      }
    },

    onMouseLeave() {
      gsap.fromTo(this.iconPath, { drawSVG: '-100%' }, { drawSVG: '0%', ease: 'expo.out', duration: 0.5 });

      if (this.icon === 'MenuButton') {
        const lines = this.iconEl.querySelectorAll('line');

        gsap.fromTo([lines[0], lines[2]], { drawSVG: '50%' }, { drawSVG: '100%', ease: 'expo.out', stagger: 0.1, duration: 0.5 });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import './IconButton';
</style>
