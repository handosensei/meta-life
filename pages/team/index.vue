<template>
  <main class="page isDark">
    <div ref="bounding" class="bounding">
      <TeamHero :title="title" data-section />
      <TeamList v-bind="coreTeam" data-section />
      <TeamList v-bind="legendaryTeam" data-section />
      <TeamList v-bind="constructionSquad" data-section />
      <TeamList v-bind="external" data-section />
      <TeamList v-bind="advisors" data-section />
      <BackToExperience theme="light" data-section />
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex';

import data from '~/content/team.json';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import Scroll from '~/mixins/scroll';

import BackToExperience from '~/components/backToExperience/BackToExperience.vue';
import TeamHero from '~/components/teamHero/TeamHero.vue';
import TeamList from '~/components/teamList/TeamList.vue';

export default {
  name: 'PartnersPage',

  components: {
    BackToExperience,
    TeamHero,
    TeamList,
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
