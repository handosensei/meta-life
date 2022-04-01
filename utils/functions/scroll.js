/**
 *
 * @param {Number} n
 * @param {Number} p
 * @returns {Number}
 */
export const toFixed = (n, p) => {
  const x = p !== undefined ? 10 ** p : 1000;
  return Math.round(n * x) / x;
};

/**
 *
 * @param {String} translate
 * @returns {String}
 */
export const getMatrix3d = (translate) => {
  return `matrix3d(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, ${translate}, 0, 1
  )`;
};
