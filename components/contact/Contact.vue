<template>
  <div class="contact">
    <div class="animation-wrapper">
      <div class="background">
        <img ref="background" src="/img/contact/background.png" alt="" />
      </div>
      <div ref="particles1" class="particle particle-1"></div>
      <div ref="particles2" class="particle particle-2"></div>
      <div ref="particles3" class="particle particle-3"></div>
      <div ref="particles3bis" class="particle particle-3bis"></div>
      <div ref="particles4" class="particle particle-4"></div>
      <div ref="particles4bis" class="particle particle-4bis"></div>
    </div>
    <div class="main">
      <h1>Contact</h1>
      <div class="infos">
        <p>
          Press : <a class="email" href="mailto:press@metalife.com">press@metalife.com</a><br />
          Infos : <a class="email" href="mailto:contact@meta-legends.com">contact@meta-legends.com</a><br />
          <br />
          Questions about economic ecosystem, read our whitepaper sections.
        </p>
      </div>
    </div>
    <div class="socials">
      <h2>Official Channel</h2>
      <ul>
        <li><a href="https://discord.gg/meta-life">Discord</a></li>
        <li><a href="https://twitter.com/metalegendsnft">Twitter</a></li>
        <li><a href="https://www.instagram.com/meta.legends/  ">Instagram</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import size from '@antinomy-studio/size';
import { gsap } from 'gsap';

export default {
  name: 'ContactComponent',

  mounted() {
    const parallaxeDuration = 0.4;
    this.particles1XTo = gsap.quickTo(this.$refs.particles1, 'x', { duration: parallaxeDuration });
    this.particles1YTo = gsap.quickTo(this.$refs.particles1, 'y', { duration: parallaxeDuration });
    this.particles2XTo = gsap.quickTo(this.$refs.particles2, 'x', { duration: parallaxeDuration });
    this.particles2YTo = gsap.quickTo(this.$refs.particles2, 'y', { duration: parallaxeDuration });
    this.backgroundXTo = gsap.quickTo(this.$refs.background, 'x', { duration: parallaxeDuration });
    this.backgroundYTo = gsap.quickTo(this.$refs.background, 'y', { duration: parallaxeDuration });
    window.addEventListener('mousemove', this.onMouseMove);

    const params = {
      yPercent: -100,
      ease: 'linear',
      repeat: -1,
    };
    gsap
      .timeline({ paused: true })
      .fromTo(
        this.$refs.particles3,
        {
          yPercent: 100,
        },
        {
          ...params,
          duration: 200,
        }
      )
      .play(100);

    gsap
      .timeline({ paused: true })
      .fromTo(
        this.$refs.particles4,
        {
          yPercent: 100,
        },
        {
          ...params,
          duration: 150,
        }
      )
      .play(75);

    gsap
      .timeline({ paused: true })
      .fromTo(
        this.$refs.particles3bis,
        {
          yPercent: 100,
        },
        {
          ...params,
          duration: 200,
        }
      )
      .play(0);

    gsap
      .timeline({ paused: true })
      .fromTo(
        this.$refs.particles4bis,
        {
          yPercent: 100,
        },
        {
          ...params,
          duration: 150,
        }
      )
      .play(0);
  },

  beforeDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
  },

  methods: {
    onMouseMove(event) {
      const parralaxX = -(event.x / size.width - 0.5) * 2;
      const parralaxY = -(event.y / size.height - 0.5) * 2;
      this.particles1XTo(parralaxX * 100);
      this.particles1YTo(parralaxY * 100);
      this.particles2XTo(parralaxX * 50);
      this.particles2YTo(parralaxY * 50);
      this.backgroundXTo(parralaxX * 5);
      this.backgroundYTo(parralaxY * 5);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './Contact';
</style>
