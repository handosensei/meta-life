export const state = () => ({
  hasPreloader: true,
  assetsPreloaded: false,
  introSkipped: false,
  menuOpen: false,
  previousTheme: '',
  theme: 'dark',
  preloaderVisible: true,
  videoPlayerOpen: false,
  windowSize: {
    width: 0,
    height: 0,
  },
  settings: {},
});

export const actions = {
  setHasPreloader({ commit }) {
    commit('SET_HAS_PRELOADER');
  },

  setAssetsPreloaded({ commit }) {
    commit('SET_ASSETS_PRELOADED');
  },

  setIntroSkipped({ commit }, bool) {
    commit('SET_INTRO_SKIPPED', bool);
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

  setPreloaderVisible({ commit }, bool) {
    commit('SET_PRELOADER_VISIBLE', bool);
  },

  setVideoPlayerOpen({ commit }, bool) {
    commit('SET_VIDEO_PLAYER_OPEN', bool);
  },

  setWindowSize({ commit }, size) {
    commit('SET_WINDOW_SIZE', size);
  },

  async initSite({ commit }) {
    const settings = await this.$datocmsClient.getSettings();
    commit('SET_SETTINGS', settings);
  },
};

export const mutations = {
  SET_HAS_PRELOADER(state, payload) {
    state.hasPreloader = payload;
  },

  SET_ASSETS_PRELOADED(state) {
    state.assetsPreloaded = true;
  },

  SET_INTRO_SKIPPED(state, payload) {
    state.introSkipped = payload;
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

  SET_PRELOADER_VISIBLE(state, payload) {
    state.preloaderVisible = payload;
  },

  SET_VIDEO_PLAYER_OPEN(state, payload) {
    state.videoPlayerOpen = payload;
  },

  SET_WINDOW_SIZE(state) {
    if (process.client) {
      state.windowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
  },

  SET_SETTINGS(state, payload) {
    state.settings = payload;
  },
};
