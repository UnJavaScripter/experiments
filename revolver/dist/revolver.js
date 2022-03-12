import { Particle } from './particle.js';
class App {
    constructor() {
        this.gameOver = false;
        this.particles = [];
        this.canvasContainerElem = document.getElementById('canvas-container');
        this.canvasElem = document.getElementById('canvas');
        this.ctx = this.canvasElem.getContext('2d');
        this.seedAmount = 100;
        // Fix resize quality degradation
        this.canvasElem.height = window.innerHeight;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentBoxSize) {
                    this.canvasElem.width = entry.contentRect.width;
                    this.canvasElem.height = Math.min(window.innerHeight, entry.contentRect.height);
                    this.stop();
                    this.init();
                }
            }
        });
        resizeObserver.observe(this.canvasContainerElem);
    }
    seed(n) {
        if (this.particles.length >= this.seedAmount) {
            return;
        }
        this.particles.push(new Particle(this.ctx, this.canvasElem.width / 2 - 200, this.canvasElem.height / 2, 10, 'lightgoldenrodyellow', true));
        for (let i = 0; i < n; i++) {
            this.particles.push(new Particle(this.ctx, Math.random() * this.canvasElem.width, Math.random() * this.canvasElem.height, Math.random() * 2.5));
        }
    }
    init() {
        this.canvasElem.addEventListener('pointermove', this.pointerMoveListener.bind(this));
        this.canvasElem.addEventListener('pointerdown', this.pointerDownListener.bind(this));
        this.seed(this.seedAmount);
        const gameLoop = () => {
            this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
            let particle;
            for (let i = 0; i < this.particles.length; i++) {
                particle = this.particles[i];
                // Massive Particles
                for (let j = 0; j < this.particles.length; j++) {
                    if (j !== i
                        && !particle.isMassive
                    // && this.particles[j].isMassive // Let the particles influence each other
                    ) {
                        this.particles[j].influence(particle);
                    }
                }
                particle.update();
            }
            if (this.gameOver) {
                cancelAnimationFrame(this.raf);
            }
            else {
                this.raf = requestAnimationFrame(gameLoop);
            }
        };
        this.raf = requestAnimationFrame(gameLoop);
    }
    pointerMoveListener(e) {
        if (e.ctrlKey || e.shiftKey) {
            this.particles[0].pos.x = e.x;
            this.particles[0].pos.y = e.y;
        }
    }
    pointerDownListener(e) {
        this.particles.push(new Particle(this.ctx, e.x, e.y, 10, this.particles.length % 2 === 0 ? 'limegreen' : 'violet', true));
    }
    stop() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);
            cancelAnimationFrame(this.raf);
        }
    }
}
new App();
