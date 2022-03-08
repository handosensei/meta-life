export default {
  mounted() {
    this.observer = new IntersectionObserver(this.onIntersection, { threshold: [0.1] })
    this.videos = Array.from(this.$el.querySelectorAll('video'))
    this.videos.forEach(el => this.observer.observe(el))
  },
  beforeDestroy() {
    this.observer && this.observer.disconnect()
  },
  methods: {
    onIntersection (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.videoInView(entry)
        } else {
          this.videoOutView(entry)
        }
      })
    },
    videoInView (entry) {
      if (entry.target.hasAttribute('data-paused')) {
        entry.target.play()
      }
    },
    videoOutView (entry) {
      if (entry.target.hasAttribute('data-playing')) {
        entry.target.setAttribute('data-paused', false)
        entry.target.pause()
      }
    }
  }
}