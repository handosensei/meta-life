import size from '@antinomy-studio/size'
import sniffer from '@antinomy-studio/sniffer'

class Mouse {
  constructor () {
    this.click = this.click.bind(this)
    this.mousemove = this.mousemove.bind(this)
    this.touchstart = this.touchstart.bind(this)

    this.pointer = {
      x: size.width * 0.5,
      y: size.height * 0.5
    }

    this.pos = {
      x: size.width * 0.5,
      y: size.height * 0.5
    }

    document.addEventListener('click', this.click)

    if (sniffer.isDesktop) {
      document.addEventListener('mousemove', this.mousemove)
    } else {
      document.addEventListener('touchstart', this.touchstart)
    }
  }

  click (event) {
    this.pointer = {
      x: event.clientX,
      y: event.clientY
    }
  }

  mousemove (event) {
    this.pos = {
      x: event.clientX,
      y: event.clientY
    }
  }

  touchstart (event) {
    const touch = event.changedTouches[0]
    this.pos = {
      x: touch.clientX,
      y: touch.clientY
    }
  }
}

export default new Mouse()
