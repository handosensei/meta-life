<template>
  <main class="page isDark">
    <div ref="bounding" class="bounding">
      <PartnersHero :title="title" data-section />
      <PartnersList v-bind="featured" data-section />
      <PartnersList v-bind="investors" data-section />
      <BackToExperience theme="light" data-section />
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex';

import data from '~/content/partners.json';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
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

  mixins: [Debug, PageTransition, Scroll],

  data() {
    return {
      ...data,
    };
  },

  mounted() {
    this.setTheme('dark');
  },

  methods: {
    ...mapActions('app', ['setTheme']),
  },
};
</script>
