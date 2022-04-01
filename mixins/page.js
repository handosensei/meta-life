import size from '@antinomy-studio/size';
import { gsap } from 'gsap';

const duration = 1.5;

export default {
  transition: {
    mode: '',
    leave(_, done) {
      gsap.delayedCall(duration, done);
    },
  },

  mounted() {
    this.addEvents();
    this.$nextTick(() => {
      this.onResize(size.width, size.height);
      this.animateIn();
    });
  },

  destroyed() {
    this.removeEvents();
  },

  methods: {
    addEvents() {
      size.addListener(this.onResize);
    },

    removeEvents() {
      size.removeListener(this.onResize);
    },

    animateIn() {
      gsap
        .timeline({
          paused: true,
        })
        .to(
          this.$el,
          {
            autoAlpha: 1,
            duration,
            ease: 'none',
          },
          0.5
        )
        .restart();
    },

    animateOut() {
      gsap
        .timeline({
          paused: true,
        })
        .to(this.$el, {
          autoAlpha: 0,
          duration,
          ease: 'none',
        })
        .restart();
    },

    onResize(width, height) {},
  },
};
