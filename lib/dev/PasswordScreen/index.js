import SparkMD5 from 'spark-md5';
import IMOG from '~/lib/imog';
import './index.scss';

export default IMOG.Component('PasswordScreen', {
  options: {
    handleSuccess: () => {},
  },

  props() {
    return {
      visible: true,
      inputLength: 0,
      state: 'dots',
    };
  },

  setup({ options }) {
    this.succeeded = false;

    const sha = process.VERCEL_GIT_COMMIT_SHA ? process.VERCEL_GIT_COMMIT_SHA.substr(0, 6) : 'DEV000';

    const template = `
      <div class="UITop">
        <div class="UITopLeft">???</div>
        <div class="UITopRight">000</div>
      </div>
      <div class="passwordDots">
        ${[0, 1, 2, 3, 4, 5].map((i) => `<div class="dot" data-index="${i}"></div>`).join('')}
      </div>
      <div class="passwordSpinner">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<div class="bar${i + 1}"></div>`).join('')}
      </div>
      <div class="passwordProgress"><div class="passwordProgressFill"></div></div>
      <textarea class="passwordTextarea"></textarea>
      <div class="passwordLabel UIBottom center">
        ENTER PASSWORD
      </div>
    `;
    this.el = document.createElement('div');
    this.el.className = 'PasswordScreen UI';
    this.el.innerHTML = template;
    document.body.appendChild(this.el);

    this.refs = {
      dots: this.el.querySelector('.passwordDots'),
      textarea: this.el.querySelector('.passwordTextarea'),
      loader: this.el.querySelector('.passwordSpinner'),
      label: this.el.querySelector('.passwordLabel'),
      progress: this.el.querySelector('.passwordProgressFill'),
    };

    this.refs.textarea.focus();

    this.refs.textarea.addEventListener('click', this.handleClick, false);
    window.addEventListener('keydown', this.handleValueChange, false);
    window.addEventListener('keyup', this.handleValueChange, false);

    const stored = window.localStorage.getItem('xl-pass');
    if (stored) {
      this.refs.textarea.value = stored;
      setTimeout(() => {
        this.handleValueChange();
      }, 0);
    }
  },

  destroy() {
    this.el.parentElement.removeChild(this.el);
    this.refs.textarea.removeEventListener('click', this.handleClick, false);
    window.removeEventListener('keydown', this.handleValueChange, false);
    window.removeEventListener('keyup', this.handleValueChange, false);
  },

  hooks: {
    'set:visible'(v) {
      this.el.style.visibility = v ? '' : 'hidden';
      this.el.style.pointerEvents = v ? '' : 'none';
    },
    'set:inputLength'(l) {
      [...this.refs.dots.children].forEach((dot, i) => {
        dot.classList[i < l ? 'add' : 'remove']('active');
      });
    },
    'set:state'(state) {
      if (state === 'loader') {
        this.refs.dots.style.opacity = 0;
        this.refs.loader.style.opacity = 1;
        this.refs.progress.parentElement.style.opacity = 1;
        this.refs.label.innerText = 'LOADING';
      }
    },
  },

  methods: {
    itemLoaded({ itemsLoaded, itemsTotal }) {
      this.refs.progress.style.width = (itemsLoaded / itemsTotal) * 100 + '%';
    },
    handleClick() {
      this.refs.textarea.focus();
    },
    handleValueChange() {
      if (this.succeeded) return;
      const val = this.refs.textarea.value;
      if (val.length > 6) {
        this.refs.textarea.value = val.substr(0, 6);
        return;
      }
      const md5 = SparkMD5.hash(val.toLowerCase());
      console.log(val, '' + md5);
      this.props.inputLength = val.length;

      if (md5 === 'eff56020d5103a90261c5b5d59ec4955') {
        window.localStorage.setItem('xl-pass', val.toLowerCase());

        this.succeeded = true;
        this.options.handleSuccess();
      }
    },
  },
});
