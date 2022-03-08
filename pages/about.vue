<template>
  <div class="About">
    <NuxtLink to="/">Index</NuxtLink>
  </div>
</template>

<script>
  import Page from '~/mixins/page'
  
  export default {
    mixins: [Page]
  }
</script>

<style lang="scss" scoped>
  .About {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    opacity: 0;
    visibility: hidden;
  }
</style>