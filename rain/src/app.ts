import { Particle, ParticleProps } from './particle.js';

class App {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  startTime: number;
  gameOver = false;
  seedAmount: number;
  particles: Particle[] = [];
  maxParticles: number;

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.canvas.addEventListener('pointerdown', this.addNewDrop.bind(this));
    this.seedAmount = 9000;
    this.maxParticles = 9000;
    this.init();
  }

  init(): void {
    let raf: number;
    const gameLoop = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.particles.length < this.maxParticles) {
        this.createSeed(this.seedAmount);
      }

      let drop1: Particle;
      let drop2: Particle;
      let distanceH: number;

      for (let i = 0; i < this.particles.length; i++) {
        drop1 = this.particles[i];
        drop1.update();

        if (drop1.landed) {
          this.particles.splice(i, 1);
        }

        // ToDo: make gooder/less badder
        // Check drops distance
        for (let j = i + 1; j < this.particles.length; j++) {
          drop2 = this.particles[j];
          distanceH = this.getHypotenuse(drop1, drop2);
          // Merge 2 drops if too close
          if (distanceH <= 10) {
            this.particles.splice(j, 1);
            drop1.x = drop1.y > drop2.y ? drop1.x : drop2.x;
            drop1.y = drop1.y > drop2.y ? drop1.y : drop2.y;
            drop1.mass += Math.min(drop1.mass, drop2.mass) / 2;
            break;
          }
        }
      }

      if (this.gameOver) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(gameLoop);
      }
    }
    raf = requestAnimationFrame(gameLoop);
    this.startTime = performance.now();
  }

  drawLine(drop1: Particle, drop2: Particle) {
    this.ctx.beginPath();
    this.ctx.moveTo(drop1.x, drop1.y)
    this.ctx.lineTo(drop2.x, drop2.y)
    this.ctx.strokeStyle = 'red'
    this.ctx.closePath();
    this.ctx.stroke();
  }

  getHypotenuse(particle1: Particle, particle2: Particle): number {
    const distanceX = Math.abs((particle1.x + (particle1.width / 2)) - (particle2.x + (particle2.width / 2)));
    const distanceY = Math.abs((particle1.y + (particle1.height / 2)) - (particle2.y + (particle2.height / 2)));
    return Math.hypot(distanceX, distanceY);
  }

  createSeed(seedAmount: number): void {
    const generatedXValues = new Set();
    let xVal;

    for (let i = 0; i <= seedAmount; i++) {
      xVal = this.getRandomInt(1, this.canvas.width - 10);

      if (generatedXValues.has(xVal)) {
        return;
      }
      generatedXValues.add(xVal);
      this.addElem({
        x: xVal,
        y: this.getRandomInt(1, 10),
        width: 4,
        height: 4,
        color: '#405086ff'
      });
    }
  }

  addElem(particleProps: ParticleProps): void {
    this.particles.push(
      new Particle(this.ctx, particleProps)
    )
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min || 1;
  }

  addNewDrop(e: PointerEvent) {
    if (this.gameOver) {
      this.init();
      this.gameOver = false;
    } else {
      this.addElem({
        x: e.x,
        y: e.y,
        width: 4,
        height: 4,
        color: '#4090c6',
      });
    }
  }

}

new App();