import gsap from 'gsap'
import size from '@antinomy-studio/size'

const duration = 0.4

export default {
  transition: {
    mode: '',
    leave: function (el, done) {
      gsap.delayedCall(duration, done)
    }
  },
  data: () => ({}),
  mounted() {
    this.addEvents()
    this.$nextTick(() => {
      this.onResize(size.width, size.height)
      this.animateIn()
    })
  },
  beforeDestroy() {
    
  },
  destroyed() {
    this.removeEvents()
  },
  methods: {
    addEvents() {
      size.addListener(this.onResize)
    },
    removeEvents() {
      size.removeListener(this.onResize)
    },
    animateIn() {
      const { from } = this.$nuxt.context
      console.log('Page:animateIn', { from })
      gsap.timeline({
        paused: true
      }).to(this.$el, {
        autoAlpha: 1,
        duration: duration,
        ease: 'none'
      }, 0.5).restart()
    },
    animateOut({ to }) {
      console.log('Page:animateOut', { to })
      gsap.timeline({
        paused: true
      }).to(this.$el, {
        autoAlpha: 0,
        duration: duration,
        ease: 'none'
      }).restart()
    },
    onResize(width, height) {
      console.log('Page:onResize')
    }
  }
}
