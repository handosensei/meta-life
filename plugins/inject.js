import Vue from 'vue';

Vue.prototype.$getPageMeta = ({ seo, news, type }) => {
  const siteName = seo.globalSeo.siteName;
  const suffix = seo.globalSeo.titleSuffix ? seo.globalSeo.titleSuffix : '';
  const title = type === 'news' ? `${news.seo?.title || news.title} - ${seo.globalSeo.siteName} ${suffix}` : `${seo.globalSeo.siteName} ${suffix}`;
  const description = type === 'news' ? `${news.seo?.description || news.description}` : seo.globalSeo.fallbackSeo.description;
  const image = type === 'news' ? news?.image?.src : seo.globalSeo.fallbackSeo.image?.url;
  const twitterCard = (type === 'news' ? news.seo.twitterCard : seo.globalSeo.fallbackSeo.twitterCard) || 'summary_large_image';
  const twitterSite = seo.globalSeo.twitterAccount;

  return {
    title,
    meta: [
      { hid: 'description', name: 'description', content: description },
      { hid: 'og:title', property: 'og:title', content: title },
      { hid: 'og:site_name', property: 'og:site_name', content: siteName },
      { hid: 'og:description', property: 'og:description', content: description },
      image && { hid: 'og:image', property: 'og:image', content: image },
      // { hid: 'og:url', property: 'og:url', content: 'https://.com' },

      { hid: 'twitter:card', name: 'twitter:card', content: twitterCard },
      // { hid: 'twitter:creator', name: 'twitter:creator', content: '@antinomystudio' },
      { hid: 'twitter:site', name: 'twitter:site', content: twitterSite },
      { hid: 'twitter:title', name: 'twitter:title', content: title },
      { hid: 'twitter:description', name: 'twitter:description', content: description },
      image && { hid: 'twitter:image:src', name: 'twitter:image:src', content: image },

      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },

      // { hid: 'keywords', name: 'keywords', content: keywords }
    ],
    link: [{ hid: 'favicon', rel: 'icon', type: seo.favicon.mimeType, href: seo.favicon.url }, ...seo.faviconMetaTags.map((favicon) => favicon.attributes)],
  };
};
