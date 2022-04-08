<template>
  <main class="page">
    <div ref="bounding" class="bounding">
      <PartnersHero :title="title" data-section />
      <PartnersList v-bind="featured" data-section />
      <PartnersList v-bind="investors" data-section />
      <BackToExperience theme="light" data-section />
    </div>
  </main>
</template>

<script>
import { gsap } from 'gsap'

import data from '~/content/partners.json';

import Debug from '~/mixins/debug';
import Page from '~/mixins/page';
import Scroll from '~/mixins/scroll';

import BackToExperience from '~/components/backToExperience/BackToExperience.vue';
import PartnersHero from '~/components/partnersHero/PartnersHero.vue';
import PartnersList from '~/components/partnersList/PartnersList.vue';

export default {
  name: 'PartnersPage',

  components: {
    BackToExperience,
    PartnersHero,
    PartnersList,
  },

  mixins: [Debug, Page, Scroll],

  data() {
    return {
      ...data,
    };
  },

  methods: {
    animateIn () {
      gsap.set(this.$el, {
        autoAlpha: 1
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.page {
  background-color: var(--color-bg-dark);
}
</style>