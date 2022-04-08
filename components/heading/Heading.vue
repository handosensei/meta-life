<template>
  <div class="sectionHeading">
    <h2
      class="heading"
      :class="{ 'isLarge': size === 'large' }"
      v-html="title"
    />

    <NuxtLink v-if="link" :to="link.href" class="link">
      <Icon type="discover" class="icon" />
      {{ link.text }}
    </NuxtLink>
  </div>
</template>

<script>
import { gsap } from 'gsap';

import Icon from '~/components/elements/Icon.vue';

export default {
  name: 'HeadingComponent',

  components: {
    Icon,
  },

  props: {
    size: {
      type: String,
      required: false,
      default: 'small',
      validator: (value) => ['small', 'large'].includes(value),
    },

    title: {
      type: String,
      required: true,
    },

    link: {
      type: Object,
      required: false,
      default: () => {}
    },
  },

  methods: {
    getEnterTl() {
      const tl = gsap.timeline();

      tl
        .fromTo(
          this.$el,
          { autoAlpha: 0 },
          { autoAlpha: 1 },
        );

      return tl;
    },

    getLeaveTl() {
      const tl = gsap.timeline();

      tl
        .fromTo(
          this.$el,
          { autoAlpha: 1 },
          { autoAlpha: 0 },
        );

      return tl;
    }
  },
}
</script>

<style lang="scss" scoped>
@import './Heading';
</style>