<template>
  <main class="page">
    <div ref="bounding" class="bounding">
      <PrivacyPolicy data-section />
      <BackToExperience data-section /> 
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex';
import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import Scroll from '~/mixins/scroll';

import BackToExperience from '~/components/backToExperience/BackToExperience.vue';
import PrivacyPolicy from '~/components/privacy-policy/PrivacyPolicy.vue'

export default {
  name: 'PrivacyPolicyPage',
  
  components: {
    PrivacyPolicy,
    BackToExperience
  },

  mixins: [Debug, PageTransition, Scroll],

  beforeMount() {
    this.setTheme('dark');
  },

  methods: {
    ...mapActions('app', ['setTheme']),
  },
};
</script>