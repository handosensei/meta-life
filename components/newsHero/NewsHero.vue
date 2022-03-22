<template>
  <div>
    <h1 class="title" v-html="title" />

    <div class="filter">
      Filter By |
      <select @change="onChange($event)">
        <option value="" checked>All categories</option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsHeroComponent',

  props: {
    title: {
      type: String,
      required: true,
    },

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
    }
  },
}
</script>

<style lang="scss" scoped>
@import './NewsHero';
</style>