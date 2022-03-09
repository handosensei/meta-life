/**
 *
 * @param {node} el
 * @param {string} src
 * @param {function} callback
 */
export const loadImage = (el, src, callback = () => {}) => {
  const img = new Image();
  if (img.decode) {
    img.src = src;
    img.decode().then(() => {
      el.src = src;
      callback();
    });
  } else {
    img.src = src;
    img.addEventListener(
      'load',
      () => {
        el.src = src;
        callback();
      },
      { once: true }
    );
  }
};
