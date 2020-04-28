import { Particle } from './particle.js';

class App {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  startTime: number;
  gameOver = false;
  particlesAmount: number;
  particles: Particle[] = [];

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.addEventListener('pointerdown', (e: PointerEvent) => {
      if (this.gameOver) {
        this.init();
        this.gameOver = false;
      } else {
        this.addElem({
          x: e.x,
          y: e.y,
          width: 4,
          height: 4,
          color: 'red',
          mass: 1
        });
      }
    });
    this.particlesAmount = 100;
    this.init();
  }

  init() {
    let raf: number;
    const gameLoop = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.particles.length < 1000) {
        this.createSeed(this.particlesAmount);
      }

      for (let i = 0; i < this.particles.length; i++) {
        const drop1 = this.particles[i];

        drop1.update();
        if (drop1.landed) {
          this.particles.splice(i, 1);
        }
        for (let j = i + 1; j < this.particles.length; j++) {
          const drop2 = this.particles[j];
          const distanceH = this.getHypotenuse(drop1, drop2);
          if (distanceH <= 10) {
            this.particles.splice(j, 1);
            drop1.x = drop1.y > drop2.y ? drop1.x : drop2.x,
              drop1.y = drop1.y > drop2.y ? drop1.y : drop2.y,
              drop1.mass = drop1.mass + drop2.mass;
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

  getHypotenuse(particle1: Particle, particle2: Particle) {
    const distanceX = Math.abs((particle1.x + (particle1.width / 2)) - (particle2.x + (particle2.width / 2)));
    const distanceY = Math.abs((particle1.y + (particle1.height / 2)) - (particle2.y + (particle2.height / 2)))
    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
  }

  createSeed(seedAmount: number) {
    const n = 0;
    const generatedXValues = new Set();
    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min)) + min || 1;
    }
    const xVal = getRandomInt(1, this.canvas.width - 10);
    if (generatedXValues.has(xVal)) {
      return;
    }
    generatedXValues.add(xVal);
    this.addElem({
      x: xVal,
      y: getRandomInt(1, 10),
      width: 4,
      height: 4,
      color: '#405086ff'
    });

    if (n < seedAmount - 1) {
      this.createSeed(seedAmount - 1);
    }

  }

  addElem(particleProps: ParticleProps) {
    this.particles.push(
      new Particle(this.ctx, particleProps)
    )
  }

}

new App()