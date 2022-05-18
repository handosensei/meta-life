export default {
  head() {
    const seo = this.$store.state.app.settings.site;
    return this.$getPageMeta({
      seo,
      type: 'page',
    });
  },
};
