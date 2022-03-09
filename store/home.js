import data from '~/content/home.json';

export const state = () => ({
  chapters: data.chapters,
  activeChapter: data.chapters[0],
  activeSection: data.chapters[0].sections[0],
});

export const actions = {
  setActiveChapter({ commit }, chapter) {
    commit('SET_ACTIVE_CHAPTER', chapter);
  },

  setActiveSection({ commit }, chapter) {
    commit('SET_ACTIVE_SECTION', chapter);
  },
};

export const mutations = {
  SET_ACTIVE_CHAPTER(state, payload) {
    state.activeChapter = payload;
  },

  SET_ACTIVE_SECTION(state, payload) {
    state.activeSection = payload;
  },
};
