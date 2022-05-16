<template>
  <div class="teamList">
    <div v-if="title" class="head">{{ title }}</div>
    <h2 v-if="title" class="title">{{ title }}</h2>

    <ul class="list">
      <li v-for="(item, index) in items" :key="`${index}-${item.title}`" class="listItem">
        <TeamCard v-bind="item" />
      </li>
    </ul>
  </div>
</template>

<script>
import TeamCard from '~/components/teamCard/TeamCard.vue';

export default {
  name: 'TeamListComponent',

  components: {
    TeamCard,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },

    title: {
      type: String,
      required: false,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import './TeamList';
</style>
