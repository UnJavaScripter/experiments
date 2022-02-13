import { Particle, ParticleProps } from './particle.js'

export class Tower extends Particle {
  lastShoot: number;
  reloadTime: number;
  attack: number;

  constructor(ctx: CanvasRenderingContext2D, props: ParticleProps, attack: number, reloadTime: number) {
    super(ctx, props);
    this.attack = attack;
    this.lastShoot = 0;
    this.reloadTime = reloadTime;
  }

  shoot(particle: Particle): number {
    if(performance.now() > this.lastShoot + this.reloadTime) {
      console.log('pew!')
      this.ctx.setLineDash([4, 16]);
      this.ctx.beginPath();
      this.ctx.lineDashOffset = 20;
      this.ctx.moveTo(this.x + (this.width / 2), this.y + (this.height / 2));
      this.ctx.lineTo(particle.x + (particle.width / 2), particle.y + (particle.height / 2));
      this.ctx.strokeStyle = '#ee5253';
      this.ctx.lineWidth = 4;
      this.ctx.closePath();
      this.ctx.stroke();
      this.lastShoot = performance.now();
      return this.attack;
    } else {
      return -1;
    }
  }
}