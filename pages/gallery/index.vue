<template>
    <main class="page isDark">
        <div ref="bounding" class="bounding">
            <GalleryList />
        </div>
    </main>
</template>


<script>
import { mapActions } from 'vuex';
import GalleryList from '~/components/galleryList/GalleryList.vue';

import Debug from '~/mixins/debug';
import PageTransition from '~/mixins/pageTransition';
import Scroll from '~/mixins/scroll';
import SEO from '~/mixins/seo';


export default {
    name: "GalleryPage",
    components: {
        GalleryList,
    },
    mixins: [Debug, PageTransition, Scroll, SEO],
    mounted() {
        this.setTheme('dark');
    },
    methods: {
        ...mapActions('app', ['setTheme']),
    },
}
</script>