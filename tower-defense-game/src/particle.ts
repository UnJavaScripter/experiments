export class ParticleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  direction: ParticleDirection;
  emoji?: string;
}
export class ParticleDirection {
  x: number;
  y: number;
}
export class ParticleVelocity {
  x: number;
  y: number;
}

export class Particle {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  direction: ParticleDirection;
  velocity: ParticleVelocity;
  initialHealth: number;
  health: number;
  emoji: string;

  constructor(ctx: CanvasRenderingContext2D, props: ParticleProps) {
    this.ctx = ctx;
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
    this.color = props.color;
    this.direction = props.direction || { x: 1, y: 1 };
    this.emoji = props.emoji || '';

    this.velocity = {
      x: 2,
      y: 2
    }

    this.initialHealth = 100;
    this.health = this.initialHealth;

    this.draw();
  }

  private draw() {
    if (this.emoji) {
      this.ctx.font = '32px system-ui';
      this.ctx.textAlign = 'center'
      this.ctx.fillStyle = `rgba(0,0,0,${Math.max(0.30, this.health/this.initialHealth)})`;
      this.ctx.fillText(this.emoji, this.x, this.y);
    } else {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height)
      this.ctx.fill();
    }
  }

  update() {
    if (this.x + this.width >= this.ctx.canvas.width || this.x <= 0) {
      this.direction.x *= -1;
    }
    if (this.y + this.height > this.ctx.canvas.height || this.y <= 0) {
      this.direction.y *= -1;
    }

    this.x = (this.x + (this.direction.x * this.velocity.x));
    this.y = (this.y + (this.direction.y * this.velocity.y));
    this.draw();
  }

  hit(damage: number) {
    this.health = this.health - damage;
    if (this.health < this.initialHealth && this.health >= this.initialHealth / 2) {
      this.color = "#ff8da1"
    }
    if (this.health <= this.initialHealth / 2) {
      this.color = "#ff748c"
    } else if (this.health <= this.initialHealth / 3) {
      this.color = "#ff284d"
    }
  }
}