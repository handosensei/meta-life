export const state = () => ({
  windowSize: {
    width: 0,
    height: 0,
  },
});

export const actions = {
  setWindowSize({ commit }, size) {
    commit('SET_WINDOW_SIZE', size);
  },
};

export const mutations = {
  SET_WINDOW_SIZE(state) {
    if (process.client) {
      state.windowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
  },
};
