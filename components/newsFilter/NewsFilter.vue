<template>
  <div class="newsFilter">
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
    }
  },
}
</script>

<style lang="scss" scoped>
@import './NewsFilter';
</style>