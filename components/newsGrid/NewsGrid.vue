<template>
  <ul class="newsGrid">
    <li v-for="item in items" :key="item.slug" class="item">
      <NuxtLink class="link" :to="`/news/${item.slug}`">
        <img :src="item.image.thumb.src" class="thumb" :alt="item.image.thumb.alt" />
        <div class="category">{{ item.category }}</div>
        <div class="title">{{ item.title }}</div>
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
  },
};
</script>

<style lang="scss" scoped>
@import './NewsGrid';
</style>
