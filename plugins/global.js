/* eslint-disable no-console */
// import Stats from 'stats.js';

import Performances from '~/utils/config/Performances';

export default async function ({ app }, inject) {
  const antinomyStyles = ['color: black', 'font-size: 14px', 'line-height: 10px', 'padding: 10px 0'].join(';');
  const theoStyle = ['color: #10b981', 'font-size: 14px', 'line-height: 10px', 'padding: 10px 0'].join(';');

  console.log('%c✦ by Antinomy Studio', antinomyStyles);
  console.log('https://antinomy.studio');

  console.log('%c✦ by Theo Lasnier', theoStyle);
  console.log('https://theo-lasnier.dev');

  // if (process.env.NODE_ENV === 'development') {
  //   const stats = new Stats();
  //   Object.assign(stats.dom.style, {
  //     top: 'initial',
  //     bottom: 0,
  //     zIndex: 99999,
  //   });
  //   document.body.appendChild(stats.dom);
  //   inject('stats', stats);
  // }

  await Performances.getPerfs();

  inject('performances', Performances);
}
