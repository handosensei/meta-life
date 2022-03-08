<template>
  <div class="Index">
    <NuxtLink to="/about">About</NuxtLink>
  </div>
</template>

<script>
  import Page from '~/mixins/page'

  export default {
    mixins: [Page]
  }
</script>

<style lang="scss" scoped>
  .Index {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    opacity: 0;
    visibility: hidden;
  }
</style>