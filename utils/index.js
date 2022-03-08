/* eslint-disable no-redeclare, no-var */
export const toFixed = function (n, p) {
  var p = p !== undefined ? 10 ** p : 1000
  return Math.round(n * p) / p
}

export function iOS () {
  if (!process.client) { return false }
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
}

export function isIpadOS () {
  return navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform)
}

export function detectWebP () {
  const elem = document.createElement('canvas')
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  } else {
    return false
  }
}

export const distance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)

export const getMatrix3d = (translate) => {
  return `matrix3d(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, ${translate}, 0, 1
  )`
}

export const loadImage = (el, src, callback = () => {}) => {
  const img = new Image()
  if (img.decode) {
    img.src = src
    img.decode().then(() => {
      el.src = src
      callback()
    })
  } else {
    img.src = src
    img.addEventListener('load', () => {
      el.src = src
      callback()
    }, { once: true })
  }
}
