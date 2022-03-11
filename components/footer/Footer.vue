<template>
  <footer class="footer" :class="{ 'isDark': theme === 'light' }">
    <div>
      Trailer Preview
    </div>

    <div>
      socials
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
}
</script>

<style lang="scss" scoped>
@import './Footer';
</style>