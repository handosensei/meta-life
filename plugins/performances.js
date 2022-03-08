import Stats from 'stats.js'
import Performances from '~/utils/Performances'
import Mouse from '~/utils/Mouse'
import { detectWebP } from '~/utils'

export default async function ({ app }, inject) {
  const styles = [
    'color: black',
    'font-size: 14px',
    'line-height: 10px',
    'padding: 10px 0'
  ].join(';')

  console.log('%c✦ by Antinomy Studio', styles)
  console.log('https://antinomy.studio')

  const stats = new Stats()
  Object.assign(stats.dom.style, {
    top: 'initial',
    bottom: 0,
    zIndex: 99999
  })
  document.body.appendChild(stats.dom)

  await Performances.getPerfs()

  inject('dpr', window.devicePixelRatio || 1)
  inject('webp', detectWebP())
  inject('stats', stats)
  inject('mouse', Mouse)
  inject('performances', Performances)
}
