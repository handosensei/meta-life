export const state = () => ({
  windowSize: {
    width: 0,
    height: 0,
  },
  assetsPreloaded: false,
  theme: 'dark',
});

export const actions = {
  setWindowSize({ commit }, size) {
    commit('SET_WINDOW_SIZE', size);
  },

  setAssetsPreloaded({ commit }) {
    commit('SET_ASSETS_PRELOADED');
  },

  setTheme({ commit }, theme) {
    commit('SET_THEME', theme);
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

  SET_ASSETS_PRELOADED(state) {
    state.assetsPreloaded = true;
  },

  SET_THEME(state, payload) {
    state.theme = payload;
  },
};
