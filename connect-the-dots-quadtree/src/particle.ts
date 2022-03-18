import { Vector2d } from "./vector2d.js"

export class Particle extends Vector2d {
  ctx: CanvasRenderingContext2D
  pos: Vector2d
  readonly radius: number
  private _color: string | undefined
  private _mass: number
  private _acc: Vector2d = new Vector2d(0, 0)
  private _velocity: Vector2d = new Vector2d(0, 0)
  private _isMassive: boolean

  private timeStamp
  private transitionDuration: number = 2000
  private opacity: number = 0

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, mass: number, color?: string, isMassive = false) {
    super(x, y)
    this.ctx = ctx
    this.pos = new Vector2d(x, y)
    this._color = color || undefined
    this.mass = mass
    this.radius = Math.sqrt(this.mass) * 3
    this._isMassive = isMassive
    this.timeStamp = performance.now()
    this.draw()
  }

  get isMassive() {
    return this._isMassive
  }

  set isMassive(val: boolean) {
    this._isMassive = val
  }

  get mass() {
    return this._mass
  }

  set mass(mass: number) {
    this._mass = mass
  }

  get acc(): Vector2d {
    return this._acc
  }

  set acc(acc: Vector2d) {
    this._acc = acc
  }

  get velocity() {
    return this._velocity
  }

  set velocity(velocity: Vector2d) {
    this._velocity = velocity
  }

  get color() {
    return this._color
  }

  set color(color: string | undefined) {
    this._color = color
  }

  private draw() {
    const opacity = this.getOpacity()
    if(this.isMassive) {
      this.ctx.fillStyle = this.color || `rgb(110, 55, 160)`
    } else {
      this.ctx.fillStyle = `rgba(64,80,134, ${opacity})`
    }
    this.ctx.beginPath()
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
    this.ctx.fill()
    // this.drawText(this.getOpacity()+"", this.pos.x, this.pos.y)
    // console.log(this.spawnTime, performance.now(),  this.getOpacity())
  }

  getOpacity() {
    if (this.opacity >= 1) {
      return 1
    }
    const now = performance.now()
    this.opacity += ((now - this.timeStamp) / this.transitionDuration)
    this.timeStamp = now
    return this.opacity || 0
  }

  findEdges() {
    if (this.pos.x >= this.ctx.canvas.width - this.radius) {
      this.pos.x = this.ctx.canvas.width - this.radius
      this.velocity.x *= -1
    } else if (this.pos.x <= this.radius) {
      this.pos.x = this.radius
      this.velocity.x *= -1
    }

    if (this.pos.y >= this.ctx.canvas.height - this.radius) {
      this.pos.y = this.ctx.canvas.height - this.radius
      this.velocity.y *= -1
    } else if (this.pos.y <= this.radius) {
      this.pos.y = this.radius
      this.velocity.y *= -1
    }
  }

  applyForce(force: Vector2d) {
    const f = Vector2d.scalarDivide(force, this.mass)
    this.acc = Vector2d.add([this.acc, f])
  }

  influence(particle: Particle, influenceDistanceThreshold: number = 1) {
    const force = Vector2d.subtract([this.pos, particle.pos])
    const distance = Vector2d.magnitudeSquared(force)
    const strength = ((this.mass * particle.mass) / distance) * 100
    const gravitationalInfluenceForce = Vector2d.setMagnitude(force, strength)

    particle.applyForce(gravitationalInfluenceForce)
    this.drawLine(this.pos, particle.pos, 1 - (Vector2d.magnitude(force) / influenceDistanceThreshold))
    // this.drawText(distance+"", this.pos.x, this.pos.y)
  }

  update() {
    this.velocity =
      Vector2d.limit(
        Vector2d.add(
          [
            this.velocity,
            Vector2d.limit(this.acc, 0.0005)
          ]
        ),
        5
      )

    this.pos = Vector2d.add([
      this.pos,
      this.velocity,
    ])

    this.acc = new Vector2d(0, 0)
    this.draw()
  }

  isOffViewport() {
    return (
      this.pos.y - this.radius * 2 > this.ctx.canvas.height ||
      this.pos.y + this.radius * 2 <= 0 ||
      this.pos.x + this.radius * 2 < 0 ||
      this.pos.x - this.radius * 2 > this.ctx.canvas.width
    )
  }

  // UI helpers
  drawLine(origin: Vector2d, target: Vector2d, intensity: number = 1) {
    this.ctx.beginPath()
    this.ctx.moveTo(origin.x, origin.y)
    this.ctx.lineTo(target.x, target.y)
    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = `rgba(102, 51, 153, ${intensity})`
    this.ctx.closePath()
    this.ctx.stroke()
  }

  drawText(label: string, x: number, y: number, size = 15, color = '#666') {
    this.ctx.font = `bold ${size}px system-ui`
    this.ctx.textAlign = "center"
    // this.ctx.fillStyle = color
    this.ctx.fillText(label, x, y)
  }
}
