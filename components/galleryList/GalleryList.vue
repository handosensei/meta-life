<template>
        <div class="galleryContent" data-section>
            <div v-for="(category, i) in categories" :key="i" class="galleryList" >
                <h3>
                    {{category.category}}
                </h3>
                <div class="galleryImgList">
                    <img v-for="(img, k) in category.slides" :key="k" class="galleryImg" :src="img.image.thumb.src" :alt="categories.category">
                </div>
            </div>
        </div>
</template>

<script>
import homeData from '~/content/home.json';
import galleryData from '~/content/gallery.json';
export default {
    name: "GalleryList",
    data() {
        return {
            galleryData,
        };
    },
    computed: {
        categories() {
            const categories = [];
            for (let i = 0; i < homeData.chapters.length; i++) {
                if(typeof homeData.chapters[i]?.sections[0]?.component?.galleryItems !== 'undefined') {
                    homeData.chapters[i]?.sections[0]?.component?.galleryItems.forEach((item) => {
                        categories.push(item);
                    });
                }
            }
            return categories;
        },
    },
}
</script>

<style lang="scss" scoped>
    @import './GalleryList';
</style>