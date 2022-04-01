/* eslint-disable no-console, no-unused-vars */

const isIE = () => {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  const trident = ua.indexOf('Trident/');
  return msie > 0 || trident > 0;
};

class Performances {
  constructor() {
    this.PERF = 0;
    this.PERFS = {
      PERF_BAD: 0,
      PERF_LOW: 1,
      PERF_GOOD: 2,
      PERF_HIGH: 3,
    };
  }

  getPerfs() {
    return new Promise((resolve) => {
      if (!process.client) {
        resolve();
      }

      let array = [];
      let quality = this.PERFS.PERF_BAD;

      const start = (window.performance || Date).now();
      for (let i = 0; i < 20000; i++) {
        array = Math.sin(Math.random()) ** 2;
      }
      const end = (window.performance || Date).now();
      const perf = end - start;

      if (isIE()) {
        quality = this.PERFS.PERF_BAD;
      } else if (perf < 7) {
        quality = this.PERFS.PERF_HIGH;
      } else if (perf < 14) {
        quality = this.PERFS.PERF_GOOD;
      } else if (perf < 22) {
        quality = this.PERFS.PERF_LOW;
      } else {
        quality = this.PERFS.PERF_BAD;
      }

      this.PERF = quality;
      console.log(this.PERF, this.PERFS);
      document.documentElement.classList.add(`perf-${this.PERF}`);

      resolve();
    });
  }
}

export default new Performances();
