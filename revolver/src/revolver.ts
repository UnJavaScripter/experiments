import { Particle } from './particle.js'

class App {
  raf: number

  canvasContainerElem: HTMLDivElement
  canvasElem: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  gameOver = false
  seedAmount: number
  particles: Particle[] = []

  constructor() {
    this.canvasContainerElem = <HTMLDivElement>document.getElementById('canvas-container')
    this.canvasElem = <HTMLCanvasElement>document.getElementById('canvas')
    this.ctx = <CanvasRenderingContext2D>this.canvasElem.getContext('2d')
    this.seedAmount = 345

    // Fix resize quality degradation
    this.canvasElem.height = window.innerHeight
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          this.canvasElem.width = entry.contentRect.width
          this.canvasElem.height = Math.min(window.innerHeight, entry.contentRect.height)
          this.stop()
          this.init()
        }
      }
    })
    resizeObserver.observe(this.canvasContainerElem)
  }

  seed(n: number) {
    if (this.particles.length >= this.seedAmount) {
      return
    }
    this.particles.push(new Particle(this.ctx,  this.canvasElem.width /2 - 200, this.canvasElem.height /2, 10, 'lightgoldenrodyellow', true))

    for (let i = 0 ; i < n ; i++) {
      this.particles.push(new Particle(this.ctx,  Math.random()*this.canvasElem.width, Math.random()*this.canvasElem.height, Math.random()*2.5))
    }

  }

  init(): void {
    this.canvasElem.addEventListener('pointermove', this.pointerMoveListener.bind(this))
    this.canvasElem.addEventListener('pointerdown', this.pointerDownListener.bind(this))
    
    this.seed(this.seedAmount)

    const gameLoop = () => {
      this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height)

      let particle: Particle
      for (let i = 0 ; i < this.particles.length ; i++) {
        particle = this.particles[i]

        // Massive Particles
        if (particle.isMassive) {
          for (let j = 0 ; j < this.particles.length ; j++) {
            if (
              j !== i
              && !this.particles[j].isMassive
              ) {
              particle.influence(this.particles[j])
            }
          }
        }
        particle.update()
      }

      if (this.gameOver) {
        cancelAnimationFrame(this.raf)
      } else {
        this.raf = requestAnimationFrame(gameLoop)
      }
    }
    this.raf = requestAnimationFrame(gameLoop)
  }

  pointerMoveListener(e: PointerEvent) {
    if (e.ctrlKey || e.shiftKey) {
      this.particles[0].pos.x = e.x
      this.particles[0].pos.y = e.y
    }
  }

  pointerDownListener(e: PointerEvent) {
    this.particles.push(new Particle(this.ctx, e.x, e.y, 10, this.particles.length % 2 === 0 ? 'limegreen' : 'violet', true))
  }

  stop() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height)
      cancelAnimationFrame(this.raf)
    }
  }
}

new App()

