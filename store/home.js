import data from '~/content/home.json';

export const state = () => ({
  chapters: data.chapters,
  chapterNavOpen: false,
  activeChapter: data.chapters[0],
  activeSection: data.chapters[0].sections[0],
  galleryOpen: false,
  audio: true,
});

export const actions = {
  setActiveChapter({ commit }, chapter) {
    commit('SET_ACTIVE_CHAPTER', chapter);
  },

  setChapterNavOpen({ commit }, bool) {
    commit('SET_CHAPTER_NAV_OPEN', bool);
  },

  setActiveSection({ commit }, chapter) {
    commit('SET_ACTIVE_SECTION', chapter);
  },

  setGalleryOpen({ commit }, bool) {
    commit('SET_GALLERY_OPEN', bool);
  },

  setAudio({ commit }, bool) {
    commit('SET_AUDIO', bool);
  },
};

export const mutations = {
  SET_ACTIVE_CHAPTER(state, payload) {
    state.activeChapter = payload;
  },

  SET_CHAPTER_NAV_OPEN(state, payload) {
    state.chapterNavOpen = payload;
  },

  SET_ACTIVE_SECTION(state, payload) {
    state.activeSection = payload;
  },

  SET_GALLERY_OPEN(state, payload) {
    state.galleryOpen = payload;
  },

  SET_AUDIO(state, payload) {
    state.audio = payload;
  },
};
