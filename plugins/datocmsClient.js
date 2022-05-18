import { request } from '@/plugins/dato-cms.js';
// import all page graphql-queries from assets
import SettingsQuery from '~/assets/graphql/queries/settings.graphql';
import newsArticle from '~/assets/graphql/queries/newsArticle.graphql';
import news from '~/assets/graphql/queries/news.graphql';

class CMSClient {
  constructor(store) {
    this.store = store;
  }

  async getPage({ name, variables = null, preview }) {
    try {
      let query = ''; // point to the right query depending on the page
      switch (name) {
        case 'news':
          query = news;
          break;
        case 'newsArticle':
          query = newsArticle;
          break;
      }
      const data = await request({
        query,
        variables,
        preview,
      });

      return data;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async getSettings() {
    try {
      const query = SettingsQuery; // make a settings graphql query for the global site settings
      const preview = query && query.preview === '1' && query.secret === process.env.CMS_DATOCMS_PREVIEW_TOKEN;
      const data = await request({
        query,
        preview,
      });
      return data;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

export default ({ store }, inject) => {
  const client = new CMSClient(store);

  inject('datocmsClient', client);
};
