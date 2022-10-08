<template>
  <div ref="galleryContent" class="galleryContent">
    <div class="scroll">
      Scroll
    </div>
    <template v-for="(item, i) in Array(3).fill(0)">
      <template v-for="imgList in gallery">
          <div v-for="(img, k) in imgList.slides" :key="img.title + i" ref="imgRow" class="imgRow" :class="{ reverse: k % 2 === 1 }">
            <div ref="imgContainer" class="imgContainer">
                <img class="galleryImg" :src="img.image.highres.src" :alt="img.title" />
                <div>
                    <h3>{{ img.title }}</h3>
                    <p>{{ imgList.category }}</p>
                </div>
            </div>
        </div>
      </template>
    </template>

  </div>
</template>

<script>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import homeData from '~/content/home.json';
import galleryData from '~/content/gallery.json';

export default {
  name: 'GalleryList',
  data() {
    return {
      galleryData,
    };
  },
  computed: {
    gallery() {
      const list = [];
      for (let i = 0; i < homeData.chapters.length; i++) {
        if (typeof homeData.chapters[i]?.sections[0]?.component?.galleryItems !== 'undefined') {
          homeData.chapters[i]?.sections[0]?.component?.galleryItems.forEach((item) => {
              list.push(item);
          });
        }
      }
      return list;
    },
  },
  mounted() {
    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      defaults: {
        overwrite: 'auto',
      },
      scrollTrigger: {
        pin: true,
        scrub: 1,
        start: 'top 35%',
        
        trigger: this.$refs.galleryContent,
        end: "+=2700%",
      },
    });

    gsap.set(this.$refs.galleryContent, { autoAlpha: 1 });

    this.$refs.imgRow.forEach((el, i) => {
      timeline.fromTo(
        el,
        {
          autoAlpha: 0,
          y: -400,
          scale: 0.5,
          zIndex: 0,
          x: 30 * (i % 2 === 0 ? 1 : -1),
        },
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          duration: 0.5,
          ease: 'none',
          scale: 1,
          zIndex: 5
        },
        '-=0.7'
      ).fromTo(
        el,
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          duration: 0.5,
          ease: 'none',
          scale: 1,
          zIndex: 6
        },
        {
          duration: 0.4,
          autoAlpha: 0,
          y: 300,
          scale: 1.5,
          ease: 'power2.in',
          zIndex: 10,
          x: 30 * (i % 2 !== 0 ? 1 : -1),
        },
        '>'
      );
    });

    this.$refs.imgContainer.forEach((el, i) => {
      gsap.fromTo(
        el,
        {
          y: 'random(-5, 5)',
          x: 'random(-5, 5)',
        },
        {
          y: 'random(-5, 5)',
          x: 'random(-5, 5)',
          duration: 2,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        }
      );
    });
  },
};
</script>

<style lang="scss" scoped>
@import './GalleryList';
</style>
