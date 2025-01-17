/* eslint-disable simple-import-sort/imports */

import { gsap } from 'gsap';
import size from '@antinomy-studio/size';
import sniffer from '@antinomy-studio/sniffer';

import { toFixed, getMatrix3d } from '~/utils/functions/scroll';

const vertical = true;
const threshold = 300;

export default {
  data() {
    return {
      header: null,
      scrollable: true,
      locked: false,
      selector: null,
      direction: null,
      last: 0,
      ease: 0.25,
      current: 0,
      target: 0,
      previous: 0,
      height: 0,
      scrolling: false,
      bounds: null,
      parent: null,
      observer: null,
      resized: false,
      cache: [],
      size: {
        width: size.width,
        height: size.height,
      },
      dom: {
        transform: null,
        scroll: process.client ? document.createElement('div') : null,
        els: [],
      },
    };
  },
  mounted() {
    this.components = new Map();
    this.parent = window;
    this.$root.$on('scroll:resize', this._onResizeForce);
    this.$root.$on('scroll:stop', this._onScrollStop);
    this.$root.$on('scroll:resume', this._onScrollResume);
    this.$root.smooth && document.body.appendChild(this.dom.scroll);
    this.$nextTick(this.onReady);
  },
  beforeDestroy() {
    this.components.clear();
    this.$root.$off('scroll:resize', this._onResizeForce);
    this.$root.$off('scroll:stop', this._onScrollStop);
    this.$root.$off('scroll:resume', this._onScrollResume);
    gsap.ticker.remove(this._onRequestAnimationFrame);
    if (sniffer.isTouch || sniffer.isIos || sniffer.isIPadOS || sniffer.isIpad) {
      window.removeEventListener('orientationchange', this._onOrientationChange);
    } else {
      size.removeListener(this._onResize);
    }
    this.parent.removeEventListener('scroll', this._onScroll);
    this.$root.smooth && document.body.removeChild(this.dom.scroll);
  },
  methods: {
    onReady() {
      if (sniffer.isTouch || sniffer.isIos || sniffer.isIPadOS || sniffer.isIpad) {
        window.addEventListener('orientationchange', this._onOrientationChange);
      } else {
        size.addListener(this._onResize);
      }
      this.parent.addEventListener('scroll', this._onScroll);
      this._onResize(size.width, size.height);
      this.$nextTick(() => {
        gsap.ticker.add(this._onRequestAnimationFrame);
      });
    },
    _scrollTo(value, duration = 2, delay = 0) {
      return gsap.to(this.parent, {
        scrollTo: value,
        duration,
        ease: 'power3.inOut',
      });
    },
    _onScrollStop() {
      this.locked = true;
      document.documentElement.classList.add('--locked');
    },
    _onScrollResume() {
      this.locked = false;
      document.documentElement.classList.remove('--locked');
    },
    _onScroll(event) {
      if (!process.client || this.locked) {
        return;
      }
      this.previous = this.target;
      this.target = this.parent.scrollY;
      this.onScroll();
    },
    onScroll() {},
    _onRequestAnimationFrame() {
      if (this.resizing) {
        return;
      }
      this.$stats && this.$stats.begin();
      this.direction = this.target > this.last ? 1 : -1;
      this.scrolling = toFixed(this.target, 0) !== toFixed(this.current, 0);
      if (this.$root.smooth) {
        this.current += (this.target - this.current) * this.ease;
      } else {
        this.current = this.target;
      }
      this.last = this.current;
      this.fixed = this.scrolling ? 3 : 0;
      const el = this.dom.sections[0];
      if (!el || !el.style) {
        return;
      }
      const translate = toFixed(this.current, this.fixed) * -1;
      const matrix3d = getMatrix3d(translate);
      this.rAFSections(matrix3d);
      this.$root.smooth && this.rAFElements();
      this.onRequestAnimationFrame();
      this.$stats && this.$stats.end();
    },
    onRequestAnimationFrame() {},
    _onResizeForce() {
      this._onResize(size.width, size.height);
    },
    _onOrientationChange() {
      this._onResize(size.width, size.height);
    },
    _onResize(width, height) {
      this.resized = true;
      this.resizing = true;
      this.size = { width, height };
      this.getSections();
      this.$root.smooth && this.getElements();
      this.$nextTick(() => {
        const el = this.$refs.bounding && this.$refs.bounding.$el ? this.$refs.bounding.$el : this.$refs.bounding ? this.$refs.bounding : this.$el.querySelector('.bounding');
        this.bounds = el.getBoundingClientRect();
        this.height = this.bounds.height;
        Object.assign(this.dom.scroll.style, {
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          height: `${this.height}px`,
          width: '1px',
        });
        this.resizing = false;
        this.$root.$emit('resize');
      });
    },
    rAFSections(matrix3d) {
      if (!this.sections) {
        return;
      }
      this.sections.forEach((data, index) => {
        const { inView } = this.isInView(data);
        const component = this.components.get(data.el);
        const height = data.bottom - data.top;
        if (data.state) {
          if (this.$root.smooth) {
            data.el.style['pointer-events'] = '';
            data.el.style.opacity = '1';
            data.el.style.transform = matrix3d;
            if (data.sticky && data.sticky.length > 0) {
              data.sticky.forEach((item, i) => {
                const min = item.masked && item.masked.top ? this.size.height * -1 : 0;
                const max = item.masked && item.masked.bottom ? this.size.height : -this.size.height;
                const fixed = gsap.utils.clamp(min, height + max, this.current - data.top);
                item.v = toFixed(fixed, this.fixed);
                item.el.style.transform = getMatrix3d(item.v);
              });
            }
          }
          if (component && !component._isDestroyed && component.rAFSection) {
            component.rAFSection(this.current, this.fixed, data);
          }
          if (this.$performances.PERF >= this.$performances.PERFS.PERF_HIGH && data.fxs.length) {
            this.rAFxs(data);
          }
        } else if (this.$root.smooth) {
          data.el.style['pointer-events'] = 'none';
          data.el.style.opacity = '0';
          data.el.style.transform = '';
        }
        data.state = inView;
        data.progress = gsap.utils.clamp(0, 1, (this.current - (data.top - size.height)) / (height + size.height));
      });
    },
    rAFxs(data) {
      data.fxs.forEach((fx, i) => {
        const { el, type, speed } = fx;
        const { start, middle } = data;
        const centered = this.current - (start - middle);
        const offset = centered * speed;
        const translate3d = toFixed(offset, this.fixed);
        let value = 'none';
        if (type === 'x') {
          value = `translate3d(${translate3d}px, 0, 0)`;
        }
        if (type === 'y') {
          value = `translate3d(0, ${translate3d}px, 0)`;
        }
        el.style.transform = value;
      });
    },
    rAFElements() {
      const threshold = 50;
      const boundary = vertical ? size.height : size.width;
      this.cache.forEach((data, index) => {
        const el = this.dom.els[index];
        const { inView, start, end, direction } = this.isInView(data);
        if (!data.state && start > -threshold && end < boundary + threshold) {
          return;
        }
        inView ? this.inView(el, data, direction) : this.outView(el, data, direction);
      });
    },
    inView(el, data, direction) {
      if (data.state) {
        return;
      }
      data.state = true;
      el.classList.remove('Out-view', `Out-${direction}`);
      el.classList.add('In-view');
    },
    outView(el, data, direction) {
      if (!data.state) {
        return;
      }
      data.state = false;
      el.classList.remove('In-view');
      el.classList.add('Out-view', `Out-${direction}`);
    },
    isInView(bounds) {
      const { top, left, bottom, right, height } = bounds;
      const scrollY = this.current;
      const boundary = vertical ? size.height : size.width;
      const start = (vertical ? top : left) - scrollY;
      const end = (vertical ? bottom : right) - scrollY;
      const inView = start < boundary + threshold && end > -threshold;
      const direction = start < 0 ? 'top' : 'bottom';
      return {
        top,
        right,
        bottom,
        left,
        height,
        start,
        end,
        inView,
        direction,
      };
    },
    getSections() {
      this.dom.sections = this.$el.querySelectorAll('[data-section]');
      this.sections = [];
      this.dom.sections.forEach((el, index) => {
        if (this.$root.smooth) {
          const translate = toFixed(this.current, this.fixed) * -1;
          el.style.transform = getMatrix3d(translate);
        }
        const bounds = this.getBounds(el);
        const header = el.getAttribute('data-header-theme');
        const sticky = el.querySelectorAll('[data-sticky]');
        const { inView, top, left, right, bottom, height } = this.isInView(bounds);
        const start = vertical ? top + (bottom - top) / 2 : left + (right - left) / 2;
        const middle = (vertical ? size.height : size.width) / 2;
        const fxs = this.getEffects(el);
        this.sections.push({
          el,
          state: inView,
          progress: gsap.utils.clamp(0, 1, (this.current - (top - size.height)) / (bottom - top + size.height)),
          header: header || null,
          sticky: sticky ? this.getSticky(sticky) : null,
          top,
          left,
          right,
          bottom,
          height,
          start,
          middle,
          fxs,
        });
        if (!this.components.has(el)) {
          const component = el.__vue__;
          component && this.components.set(el, component);
        }
      });
    },
    getSticky(sticky) {
      return [...sticky].map((el) => {
        return {
          v: 0,
          el,
          masked: el.hasAttribute('data-sticky-masked')
            ? {
                top: el.hasAttribute('data-sticky-masked-top'),
                bottom: el.hasAttribute('data-sticky-masked-bottom'),
              }
            : false,
        };
      });
    },
    getElements() {
      this.dom.els = this.$el.querySelectorAll('[data-in-view]');
      if (this.dom.els) {
        this.cache = [];
        this.dom.els.forEach((el, index) => {
          const bounds = this.getBounds(el);
          const { inView, top, left, right, bottom, direction } = this.isInView(bounds);
          this.cache.push({
            state: !inView,
            top,
            left,
            right,
            bottom,
          });
          inView ? this.inView(el, this.cache[index], direction) : this.outView(el, this.cache[index], direction);
        });
      }
    },
    getEffects(el) {
      const fxs = [];
      const effects = Array.from(el.querySelectorAll('[data-fx]'));
      effects.forEach((el, i) => {
        const type = el.getAttribute('data-fx');
        const speed = el.getAttribute('data-speed') || 0;
        fxs.push({ el, type, speed });
      });
      return fxs;
    },
    getBounds(el) {
      const scrollY = this.current;
      const bounding = el.getBoundingClientRect();
      return {
        top: bounding.top + (vertical ? scrollY : 0),
        right: bounding.right + (vertical ? 0 : scrollY),
        bottom: bounding.bottom + (vertical ? scrollY : 0),
        left: bounding.left + (vertical ? 0 : scrollY),
        height: bounding.height,
      };
    },
  },
};
