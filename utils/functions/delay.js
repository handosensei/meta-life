/**
 *
 * @param {number} ms
 * @returns {promise}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default delay;
