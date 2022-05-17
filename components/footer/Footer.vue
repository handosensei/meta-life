<template>
  <footer class="footer">
    <Credits class="footerCredits" />

    <div class="footerRight">
      <Socials class="footerSocials" />
    </div>
  </footer>
</template>

<script>
import Credits from '~/components/credits/Credits.vue';
import Socials from '~/components/socials/Socials.vue';

export default {
  name: 'FooterComponent',

  components: {
    Credits,
    Socials,
  },
};
</script>

<style lang="scss" scoped>
@import './Footer';
</style>
