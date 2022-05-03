<template>
  <div class="partnersList">
    <div v-if="title" class="head">{{ title }}</div>
    <h2 v-if="title" class="title">{{ title }}</h2>

    <ul class="list">
      <li v-for="(item, index) in items" :key="`${index}-${item.title}`" class="listItem">
        <PartnersCard v-bind="item" />
      </li>
    </ul>
  </div>
</template>

<script>
import PartnersCard from '~/components/partnersCard/PartnersCard.vue';

export default {
  name: 'PartnersListComponent',

  components: {
    PartnersCard,
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
@import './PartnersList';
</style>
