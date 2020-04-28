export class Particle {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  direction: ParticleDirection;
  velocity: ParticleVelocity;
  mass: number;
  landed: boolean;
  gravity: number;

  constructor(ctx: CanvasRenderingContext2D, props: ParticleProps) {
    this.ctx = ctx;
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
    this.color = props.color || 'azure';
    this.direction = props.direction || { x: 0, y: 1 };
    this.mass = props.mass || 10;

    this.landed = false;
    this.gravity = 9.8;

    this.velocity = {
      x: 0,
      y: 0
    }

    this.draw();
  }

  private draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height)
    this.ctx.fill();
  }

  update() {
    if (this.y + this.height > this.ctx.canvas.height || this.y <= 0) {
      this.landed = true;
    } else {
      const t = (Math.pow(this.x, 2) * this.gravity) / 2;

      this.x = (this.x + (this.direction.x * this.velocity.x));
      this.y += (this.mass * this.gravity) / 100;
      // this.ctx.font = '10px serif';
      // this.ctx.fillText(Math.round(Math.floor(this.mass)).toString(), this.x, this.y);
    }
    this.draw();

  }

}