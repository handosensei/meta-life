/**
 *
 * @param {array} array
 * @param {object} object
 * @returns {number}
 */
const getObjectIndexById = (array, object) => {
  return array.findIndex(({ id }) => id === object.id);
};

/**
 *
 * @param {array} chapters
 * @param {object} activeChapter
 * @param {object} activeSection
 * @returns {object}
 */
export const goToNextSection = (chapters, activeChapter, activeSection) => {
  const activeChapterIndex = getObjectIndexById(chapters, activeChapter);
  const activeSectionIndex = getObjectIndexById(activeChapter.sections, activeSection);
  const nbChapters = chapters.length;
  const nbSectionsInChapter = activeChapter.sections.length;

  let newActiveChapter = activeChapter;
  let newActiveSection = activeSection;

  if (activeSectionIndex === nbSectionsInChapter - 1 && activeChapterIndex < nbChapters - 1) {
    // If activeSection is the last section in activeChapter
    // and if activeChapter is not the last chapter in the array
    newActiveChapter = chapters[activeChapterIndex + 1];
    newActiveSection = newActiveChapter.sections[0];
  } else if (activeSectionIndex < nbSectionsInChapter - 1) {
    // If activeSection is not the last section in ActiveChapter
    newActiveSection = activeChapter.sections[activeSectionIndex + 1];
  }

  return {
    chapter: newActiveChapter,
    section: newActiveSection,
  };
};

/**
 *
 * @param {array} chapters
 * @param {object} activeChapter
 * @param {object} activeSection
 * @returns {object}
 */
export const goToPreviousSection = (chapters, activeChapter, activeSection) => {
  const activeChapterIndex = getObjectIndexById(chapters, activeChapter);
  const activeSectionIndex = getObjectIndexById(activeChapter.sections, activeSection);

  let newActiveChapter = activeChapter;
  let newActiveSection = activeSection;

  if (activeSectionIndex === 0 && activeChapterIndex > 0) {
    // If activeSection is the first section in activeChapter
    // and if activeChapter is not the first chapter in the array
    newActiveChapter = chapters[activeChapterIndex - 1];
    newActiveSection = newActiveChapter.sections[newActiveChapter.sections.length - 1];
  } else if (activeSectionIndex > 0) {
    // If activeSection is not the first section in ActiveChapter
    newActiveSection = activeChapter.sections[activeSectionIndex - 1];
  }

  return {
    chapter: newActiveChapter,
    section: newActiveSection,
  };
};

/**
 *
 * @param {array} chapters
 * @param {object} activeChapter
 * @returns {number}
 */
export const getChapterIndex = (chapters, activeChapter) => {
  return getObjectIndexById(chapters, activeChapter);
};
