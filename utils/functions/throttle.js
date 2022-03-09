/**
 *
 * @param {function} func
 * @param {number} delay
 * @param {boolean} immediate
 * @returns {function}
 */
const throttle = (func, delay, immediate) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
    if (callNow) func.apply(context, args);
  };
};

export default throttle;
