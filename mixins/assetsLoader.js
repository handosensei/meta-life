export default {
  data() {
    return {
      total: 0,
      loaded: 0,
      assets: {},
      tasks: [],
      completed: 0,
      current: 0,
      handle: null,
      concurrency: 10,
    };
  },

  created() {
    this.$nuxt.$on('assetsLoader:load', this.onLoad);
  },

  beforeDestroy() {
    this.$nuxt.$off('assetsLoader:load', this.onLoad);
  },

  methods: {
    onLoad(assets) {
      this.loadAssets(assets);
    },

    loadAssets(assets) {
      this.total = assets.length;
      this.loaded = 0;

      return new Promise((resolve) => {
        assets.forEach((asset, index) => {
          this.enqueueTask(this.loadImage, asset, (data) => {
            this.assets[index] = { index, data };
            this.loaded += 1;

            if (this.loaded === this.total) {
              resolve({
                assets: this.assets,
              });
            }
          });
        });
      });
    },

    enqueueTask(handler, data = null, callback) {
      this.tasks.push({
        handler,
        data,
        callback,
      });

      if (!this.handle) {
        this.handle = requestIdleCallback(this.runTask, { timeout: 1000 });
      }
    },

    runTask(deadline) {
      while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.tasks.length && this.current - this.completed < this.concurrency) {
        const task = this.tasks.shift();
        this.current += 1;

        task.handler(task.data).then((result) => {
          if (task.callback) task.callback(result);
          this.completed += 1;
        });
      }

      if (this.tasks.length) {
        this.handle = requestIdleCallback(this.runTask, { timeout: 1000 });
      } else {
        this.handle = 0;
      }
    },

    loadImage(url) {
      return new Promise((resolve, reject) => {
        const image = new Image();

        const fallback = () => {
          image.setAttribute('crossOrigin', 'anonymous');
          image.addEventListener('error', reject);
          image.addEventListener(
            'load',
            () => {
              image.removeEventListener('error', reject);
              resolve(image);
            },
            { once: true }
          );
          image.src = url;
        };

        if (image.decode) {
          image.src = url;
          image
            .decode()
            .then(() => {
              resolve(image);
            })
            .catch(fallback);
        } else {
          fallback();
        }
      });
    },
  },
};
