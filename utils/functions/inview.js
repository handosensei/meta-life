export const inview = (el, a, b) => {
  const { top, bottom } = el.getBoundingClientRect();
  return top < a && bottom >= b;
};
