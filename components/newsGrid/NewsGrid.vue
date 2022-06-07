<template>
  <ul class="newsGrid">
    <li v-for="item in items" :key="item.slug" class="item">
      <NuxtLink class="link" :to="`/news/${item.slug}`">
        <div class="thumb">
          <img :src="item.image.src" :alt="item.image.alt" />
        </div>
        <div class="row">
          <div>
            <div class="category">{{ item.articleType }}</div>
            <div class="title">{{ item.title }}</div>
          </div>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <line y1="29.5" x2="60" y2="29.5" stroke="white"/>
              <line x1="30.5" y1="2.18557e-08" x2="30.5" y2="60" stroke="white"/>
            </g>
          </svg>
        </div>
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
