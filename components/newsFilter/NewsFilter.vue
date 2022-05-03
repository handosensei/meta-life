<template>
  <div class="newsFilter">
    <div class="title">Filter by</div>
    <div class="filter">
      <select class="select" @change="onChange($event)">
        <option value="" checked>All categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsFilterComponent',

  props: {
    categories: {
      type: Array,
      required: true,
    },

    selectCategory: {
      type: Function,
      required: true,
    },
  },

  methods: {
    onChange({ target: { value } }) {
      this.selectCategory(value);

      this.$nextTick(() => {
        this.$root.$emit('scroll:resize');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './NewsFilter';
</style>
