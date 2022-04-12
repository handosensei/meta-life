import { gsap } from 'gsap';

const TRANSITION_DURATION = 0.7;

export default {
  transition: {
    name: 'Default',

    enter(el) {
      gsap.fromTo(el, { autoAlpha: 0 }, { duration: TRANSITION_DURATION, autoAlpha: 1 });
    },

    leave(el, done) {
      gsap.set(el, { autoAlpha: 0 });

      gsap.fromTo(el, { autoAlpha: 1 }, { duration: TRANSITION_DURATION, autoAlpha: 0, onComplete: done });
    },
  },
};
