<template>
  <main class="page">
    <PartnersHero :title="title" />
    <PartnersList v-bind="featured" />
    <PartnersList v-bind="investors" />
    <BackToExperience theme="light" />
  </main>
</template>

<script>
import data from '~/content/partners.json';

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

  data() {
    return {
      ...data,
    };
  },
}
</script>

<style lang="scss" scoped>
.page {
  background-color: var(--color-bg-dark);
}
</style>