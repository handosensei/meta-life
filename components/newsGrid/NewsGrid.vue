<template>
  <ul class="newsItems">
    <li
      v-for="item in items"
      :key="item.slug"
      class="newsItem"
    >
      <NuxtLink class="newsLink" :to="`/news/${item.slug}`">
        <img :src="item.image.thumb.src" class="newsThumb" :alt="item.image.thumb.alt">
        <div class="newsCategory">{{ item.category }}</div>
        <div class="newsTitle">{{ item.title }}</div>
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