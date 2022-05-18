export const actions = {
  async nuxtServerInit({ state, dispatch, commit }, { req }) {
    await dispatch('app/initSite');
  },
};
