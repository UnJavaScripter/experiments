import { Particle, ParticleProps } from './particle.js';

class App {
  raf: number;

  canvasContainerElem: HTMLDivElement;
  canvasElem: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  startTime: number;
  gameOver = false;
  seedAmount: number;
  particles: Particle[] = [];
  maxParticles: number;
  distanceThreshold: number;

  constructor() {
    this.canvasContainerElem = <HTMLDivElement>document.getElementById('canvas-container');
    this.canvasElem = <HTMLCanvasElement>document.getElementById('canvas');
    this.ctx = <CanvasRenderingContext2D>this.canvasElem.getContext('2d');
    this.canvasElem.addEventListener('pointerdown', this.addNewDrop.bind(this));
    this.seedAmount = 10;
    this.maxParticles = Math.ceil(window.innerWidth * 0.08);
    this.distanceThreshold = 200;

    // Fix resize quality degradation
    this.canvasElem.height = window.innerHeight;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          this.canvasElem.width = entry.contentRect.width
          this.canvasElem.height = Math.min(window.innerHeight, entry.contentRect.height);
          this.stop();
          this.init();
        }
      }
    });
    resizeObserver.observe(this.canvasContainerElem);
  }

  init(): void {
    const gameLoop = () => {
      this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
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

        if (drop1.master) {
          for (let j = 0; j < this.particles.length; j++) {
            drop2 = this.particles[j];
            if (!drop2.master) {
              distanceH = this.getHypotenuse(drop1, drop2);
              if (distanceH <= this.distanceThreshold) {
                this.drawLine(drop1, drop2, 1 - (distanceH / this.distanceThreshold))
              }
            }
          }
        }


      }

      if (this.gameOver) {
        cancelAnimationFrame(this.raf);
      } else {
        this.raf = requestAnimationFrame(gameLoop);
      }
    }
    this.raf = requestAnimationFrame(gameLoop);
    this.startTime = performance.now();
  }

  stop() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
      cancelAnimationFrame(this.raf);
    }
  }

  drawLine(drop1: Particle, drop2: Particle, intensity: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(drop1.x, drop1.y)
    this.ctx.lineTo(drop2.x, drop2.y)
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = `rgba(102, 51, 153, ${intensity})`;
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
      xVal = this.getRandomInt(1, this.canvasElem.width);

      if (generatedXValues.has(xVal)) {
        return;
      }
      generatedXValues.add(xVal);
      this.addElem({
        x: xVal,
        y: this.getRandomInt(1, this.canvasElem.height),
        width: 6,
        height: 6,
        color: '#405086ff',
        mass: this.getRandomInt(1, 10),
        master: this.getRandomInt(10, 50) > 40 ? true : false
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
      const bcr = this.canvasElem.getBoundingClientRect()
      const x = e.clientX - bcr.left
      const y = e.clientY - bcr.top
      this.addElem({
        x: x,
        y: y,
        width: 8,
        height: 8,
        mass: this.getRandomInt(10, 50),
        master: true
      });
    }
  }

}

new App();

