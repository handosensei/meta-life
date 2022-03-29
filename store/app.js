export const state = () => ({
  windowSize: {
    width: 0,
    height: 0,
  },
  assetsPreloaded: false,
  menuOpen: false,
  previousTheme: '',
  theme: 'dark',
});

export const actions = {
  setWindowSize({ commit }, size) {
    commit('SET_WINDOW_SIZE', size);
  },

  setAssetsPreloaded({ commit }) {
    commit('SET_ASSETS_PRELOADED');
  },

  setMenuOpen({ commit }, bool) {
    commit('SET_MENU_OPEN', bool);
  },

  setPreviousTheme({ commit }, theme) {
    commit('SET_PREVIOUS_THEME', theme);
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

  SET_MENU_OPEN(state, payload) {
    state.menuOpen = payload;
  },

  SET_PREVIOUS_THEME(state, payload) {
    state.previousTheme = payload;
  },

  SET_THEME(state, payload) {
    state.theme = payload;
  },
};
