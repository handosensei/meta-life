<template>
  <div class="gallery">
    <h2 class="title">{{ title }}</h2>

    <div
      v-for="item in items"
      :key="item.id"
      class="item"
    >
      <img :src="item.image.thumb.src" :alt="item.image.thumb.alt">
      <div>
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryComponent',

  props: {
    items: {
      type: Array,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  }
}
</script>

<style lang="scss" scoped>
@import './Gallery';
</style>