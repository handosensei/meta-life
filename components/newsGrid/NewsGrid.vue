<template>
  <ul>
    <li
      v-for="item in items"
      :key="item.slug"
      class="item"
    >
      <NuxtLink :to="`/news/${item.slug}`">
        <img :src="item.image.thumb.src" :alt="item.image.thumb.alt">
        <div>{{ item.category }}</div>
        <div>{{ item.title }}</div>
      </NuxtLink>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'NewsGridComponent',

  props: {
    items: {
      type: Array,
      required: true,
    },
  }
}
</script>

<style lang="scss" scoped>
@import './NewsGrid';
</style>