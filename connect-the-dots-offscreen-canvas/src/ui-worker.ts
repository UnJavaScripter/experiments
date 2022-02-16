import { Particle, ParticleProps } from './particle.js';

let particles: Set<Particle> = new Set();

let canvas: HTMLCanvasElement;
let ctx: any;
let maxParticles: number;
let seedAmount: number;
let raf = 0;
let width: number;
let height: number;
let distanceThreshold: number;

self.onmessage = function (e: MessageEvent) {
  const messageType = e.data.message;
  const data = e.data.data;

  if (e.data.canvas) {
    canvas = e.data.canvas;
    ctx = canvas.getContext("2d", {alpha: true});
    init(canvas);
  } else {
    if (messageType === 'init') {
      maxParticles = data.maxParticles;
      seedAmount = data.seedAmount;
      width = data.width;
      height = data.height;
    }
  
    if (messageType === 'stop') {
      stop();
    }
    
    if (messageType === 'add') {
      addElem(data);
    }
  }
  
}

function init(canvas: any) {

  canvas.width = width;
  canvas.height = height;
  distanceThreshold = Math.log(width)*20;
  const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.size < maxParticles) {
      createSeed(Math.ceil(seedAmount/2));
    }

    let drop1;
    let drop2;
    let distanceH: number;

    for (drop1 of particles) {
      drop1.update();

      if (drop1.landed) {
        particles.delete(drop1)
      }
      
        if (drop1.master) {
          for (drop2 of particles) {
            if (!drop2.master) {
              distanceH = getHypotenuse(drop1, drop2);
              if (distanceH <= distanceThreshold) {
                drawLine(drop1, drop2, 1 - (distanceH / distanceThreshold));
              }
            }
          }
        }

    }
    const bitmap = canvas.transferToImageBitmap();
    self.postMessage({msg: 'render', bitmap});

    raf = requestAnimationFrame(gameLoop);
  }
  raf = requestAnimationFrame(gameLoop);
}

function stop (){
  particles.clear();
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(raf);
  }
}


function drawLine(drop1: Particle, drop2: Particle, intensity: number) {
  const linkIntensity = Math.min(Math.min(drop1.opacity, drop2.opacity), intensity)
  ctx.beginPath();
  ctx.moveTo(drop1.x, drop1.y);
  ctx.lineTo(drop2.x, drop2.y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = `rgba(102, 51, 153, ${linkIntensity})`;
  ctx.closePath();
  ctx.stroke();
}

function createSeed(seedAmount: number): void {
  let xVal;
  let particleProps;
  for (let i = 0; i <= seedAmount; i++) {
    xVal = getRandomInt(canvas.width * 0.05, canvas.width);
    particleProps = {
      x: xVal,
      y: getRandomInt(1, canvas.height*0.9),
      size: 2,
      color: '#40508699',
      mass: getRandomInt(1, 10),
      master: getRandomInt(10, 50) > 40 ? true : false
    }
    addElem(new Particle(ctx, particleProps))
  }
}

function addElem(particleProps: ParticleProps): void {
  particles.add(new Particle(ctx, particleProps))
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min || 1;
}


function getHypotenuse(particle1: Particle, particle2: Particle): number {
  const distanceX = Math.abs((particle1.x + (particle1.size / 2)) - (particle2.x + (particle2.size / 2)));
  const distanceY = Math.abs((particle1.y + (particle1.size / 2)) - (particle2.y + (particle2.size / 2)));
  return Math.hypot(distanceX, distanceY);
}